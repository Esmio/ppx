import { request } from '../utils/';

export async function getSpecialOfferList(params){
	console.log('params', params)
	return request(`http://192.168.1.25:7000/api/v1/cms/internal/promotion?contentType=PC_PROMOTION`)
}