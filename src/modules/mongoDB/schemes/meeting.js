import { Schema, model } from 'mongoose'
const schema = new Schema({
	meetingID: {
		type: Schema.Types.String,
		unique:true
	},
	//Link to join the Meetzi meeting
	joinLinks:{
		type: Schema.Types.String
	}
})


const Meeting = model('Meeting', schema);
export default Meeting;