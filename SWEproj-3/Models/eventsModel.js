const mongoose = require('mongoose');
const { Schema } = mongoose;
const EventSchema = new Schema({

    title :{
        type : String,  require : true 
    },
    description : {
        type : String, require : true ,

    },
    Date :{
        type : Date , require : true 
      },
    location :{
        type : String , require : true 
      },
    category :{
        type : String , require : true 
      },
    Image :{
        type : String , require : true 
      },

      ticketpricing :{
        type : Number , require : true 
      },
      status: {  
        type: String,
        enum: ["pending", "approved", "declined"],
        default: "pending"
    },
    
    availableTickets :{
        type : Number , require : true 
      },






      // YOUSEF's PART


      // point 3.

      organizer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      }
      },

      
       {
         timestamps: true
        });
      
        module.exports = mongoose.model('Event', EventSchema);
    
