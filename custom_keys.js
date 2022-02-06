function drawKeys(canvasElement)
{
    let  canvas_width = canvasElement.width;
    let canvas_height = canvasElement.height;


    let canvasCtx     = canvasElement.getContext('2d');



   let number_of_keys = 24;

   let number_of_pixel_for_key = ( canvas_width/number_of_keys);


   for(let i = 0; i < number_of_keys+1;i++)
   {
       canvasCtx.beginPath();
       canvasCtx.rect(0,canvas_height-400 , number_of_pixel_for_key*i, 400);
       canvasCtx.strokeStyle = "white";
       canvasCtx.stroke();

   }





}
