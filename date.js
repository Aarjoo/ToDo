exports.findDate = function()
{
    const date = new Date();
    const options ={
        weekday:"long",
        day:"numeric",
        month:"long"       
        
    };
    return todayDate = date.toLocaleDateString("en-Us", options);
}
