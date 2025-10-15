import Menu from "../models/menu.model";
import { ApiError, ApiResponse } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";

const validDays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

const getMenuByDate = asyncHandler(async (req, res) => {
    const date = new Date(req.params.date);
    const day = validDays[date.getDay()];

    const menuDetails = await Menu.findOne({ day })
    .sort({ date: -1 }) // Get the most recent menu for that day
    .lean(); // Use lean() for better performance if you don't need Mongoose document methods. (menuDetails will be a plain JS object)

    if(!menuDetails){
        throw new ApiError(404, "Menu not found for the given date");
    } 
    return res.status(200)
    .json(
        new ApiResponse(
            200,
            menuDetails,
            "Menu fetched successfully"
        )
    )
})

const getMenuByDay = asyncHandler(async (req, res) => {
    const day = req.params.day.toLowerCase();
    

    if (!validDays.includes(day)) {
        throw new ApiError(400, "Invalid day provided");
    }

    const menuDetails = await Menu.find({ day });
    if (!menuDetails) {
        throw new ApiError(404, "Menu not found for the given day");
    }
    return res.status(200)
    .json(
        new ApiResponse(
            200,
            menuDetails,
            "Menu fetched successfully"
        )
    )
})

const updateMenu = asyncHandler(async (req, res) => {
    const { date, day, breakfast, lunch, dinner } = req.body;
    if(!date || !day || !breakfast || !lunch || !dinner) {
        throw new ApiError(400, "All fields are required");
    }
    const validDays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    if (!validDays.includes(day.toLowerCase())) {
        throw new ApiError(400, "Invalid day provided");
    }
    if(breakfast){
        await Menu.findOneAndUpdate({ date }, { day, breakfast }, { upsert: true });
    }
    if(lunch){
        await Menu.findOneAndUpdate({ date }, { day, lunch }, { upsert: true });
    }
    if(dinner){
        await Menu.findOneAndUpdate({ date }, { day, dinner }, { upsert: true });
    }
    const menu = await Menu.findOne({ date });
    if (!menu) {
        throw new ApiError(500, "Failed to update menu");
    }
    return res.status(201)
    .json(
        new ApiResponse(
            201,
            menu,
            "Menu updated successfully"
        )
    )
})

const getExtraItems = asyncHandler(async(req, res) => {
    const date = new Date(req.params.date);
    const menuDetails = await Menu.findOne({ date });
    if (!menuDetails) {
        throw new ApiError(404, "Menu not found for the given date");
    }
    return res.status(200)
    .json(
        new ApiResponse(
            200,
            menuDetails.extraItems,
            "Extra items fetched successfully"
        )
    )
})
export {
    getMenuByDate,
    getMenuByDay,
    updateMenu,
    getExtraItems
}