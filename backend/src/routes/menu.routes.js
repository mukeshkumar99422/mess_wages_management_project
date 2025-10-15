import {Router} from 'express'
import { getMenuByDate, getMenuByDay } from '../controllers/mess.controller'

const messRouter = Router()

messRouter.route('/date/:date').get(getMenuByDate)
messRouter.route('/day/:day').get(getMenuByDay)
export {messRouter}