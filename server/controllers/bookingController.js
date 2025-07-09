import Booking from "../models/Booking.js";
import Show from "../models/Show.js";


const checkSeatsAvailability = async (showId, selectedSeats) => {
    try {
        const showData = await Show.findById(showId);
        if (!showData) return false;

        const occupiedSeats = showData.occupiedSeats;
        const isAnySeatTaken = selectedSeats.some(seat => occupiedSeats[seat]);
        return !isAnySeatTaken;
    } catch (error) {
        console.log(error.message);
        return false;
    }
}


export const createBooking = async (req, res) => {
    try {
        const {userId} = req.auth();
        const { showId, selectedSeats } = req.body;
        const {origin} = req.headers;

        const isSeatsAvailable = await checkSeatsAvailability(showId, selectedSeats);
        if (!isSeatsAvailable) {
            return res.json({success: false, message: "Seats are not available"});
        }

        const showData = await Show.findById(showId).populate("movie");

        const booking = await Booking.create({
            user: userId,
            show: showId,
            bookedSeats: selectedSeats,
            amount: showData.showPrice * selectedSeats.length,
        });

        selectedSeats.map((seat) => {
            showData.occupiedSeats[seat] = userId;
        })
        showData.markModified("occupiedSeats");
        await showData.save();

        res.json({success: true, message: "Booking created successfully"});
    } catch (error) {
        console.error(error.message);
        res.json({success: false, message: error.message});
    }
}


export const getOccupiedSeats = async (req, res) => {
    try {
        const {showId} = req.params;
        const showData = await Show.findById(showId);
        
        const occupiedSeats = Object.keys(showData.occupiedSeats);

        res.json({success: true, occupiedSeats});
    } catch (error) {
        console.error(error.message);
        res.json({success: false, message: error.message});
    }
}

