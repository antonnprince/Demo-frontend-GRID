import React, { useRef, useState, useEffect } from 'react';

const Fruits = () => {
  const videoRef = useRef(null);
  const receiveRef = useRef(null)
  const [showPrompt, setShowPrompt] = useState(true)
  const [cameraOn, setCameraOn] = useState(false);
  const canvasRef = useRef(null); 
  const[items, setItems] = useState([])
  const [isOn, setIsOn] = useState(false);


    useEffect(()=>{
        
    })


 


  const startCamera = async () => {
    try {
        const constraints = {
            video: {
                facingMode: {
                    ideal: "environment"
                }
            }
        }
        setCameraOn(true)
         navigator.mediaDevices.getUserMedia(constraints)
        .then(stream=>{
            videoRef.current.srcObject=stream
            sendFeedToServer(videoRef.current)
        })
        } catch (err) {
            console.error('Error accessing camera:', err);
            const fallbackConstraints = { video: true }; // Default camera
                navigator.mediaDevices.getUserMedia(fallbackConstraints)
                    .then(stream => {
                        videoRef.current.srcObject = stream;  // Display fallback camera feed in the preview
                        // document.getElementById('cameraModal').style.display = 'none';
                    })
                    .catch(fallbackError => {
                        console.error('Error accessing default camera: ', fallbackError);
                    });
        }
    };

  
    async function sendFeedToServer(video) {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      let feedwebsocket, objectwebsocket;
      const reconnectInterval = 500; // 500 ms
  
function connectFeedWebSocket() {
          feedwebsocket = new WebSocket(`wss://backend.angeloantu.online/ws/camera_feed_fruit`);
          
          feedwebsocket.onopen = () => {
              console.log('Feed WebSocket connected');
              setInterval(() => {
                  if (video.readyState === 4 && video.videoWidth && video.videoHeight) {
                      canvas.width = video.videoWidth;
                      canvas.height = video.videoHeight;
                      context.drawImage(video, 0, 0, canvas.width, canvas.height);
                      const imageData = canvas.toDataURL('image/jpeg'); // Capture frame as JPEG
  
                      // Send the image data to the WebSocket server
                      if (feedwebsocket.readyState === WebSocket.OPEN) {
                          feedwebsocket.send(imageData);
                      }
                  }
              }, 500); // Capture and send at a delay
          };
  
          feedwebsocket.onerror = (error) => {
              console.error('Feed WebSocket error:', error);
          };
  
          feedwebsocket.onclose = () => {
              console.log('Feed WebSocket connection closed. Reconnecting...');
              setTimeout(connectFeedWebSocket, reconnectInterval);
          };
  
          feedwebsocket.onmessage = (event) => {
              // Set the source of the img element to the received image
              // const imageFeed = document.getElementById('cameraFeed');
              const base64Image = event.data
              receiveRef.current.src = base64Image;; // Set the source to the received image
          };
      }
  
      function connectObjectWebSocket() {
          objectwebsocket = new WebSocket(`wss://backend.angeloantu.online/ws/fruits`);
  
          objectwebsocket.onopen = () => {
              console.log("Object WebSocket connected");
          };
  
          objectwebsocket.onerror = (error) => {
              console.error("Object WebSocket error:", error);
          };
  
          objectwebsocket.onclose = () => {
              console.log("Object WebSocket connection closed. Reconnecting...");
              setTimeout(connectObjectWebSocket, reconnectInterval);
          };
  
         
            objectwebsocket.onmessage = (event) => {
            console.log("items data :",event.data);
            try {
              const newItem = JSON.parse(event.data)
              setItems(newItem)
              // console.log(items)
            } catch (error) {
              console.log(error)
            }
         
     }
      }
  
      // Initialize both WebSocket connections
      connectFeedWebSocket();
      connectObjectWebSocket();
  }

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
      receiveRef.current.src=null
      setCameraOn(false);
    }
  };

  const toggle = () => {
    setIsOn((prevState) => !prevState);
  };

  

  return (
    <div className='p-2 md:p-4'>
      {
        showPrompt && 
        <div className='flex  bg-[#525252] w-full md:w-1/2 lg:w-1/5 mx-auto p-2 flex-col text-white shadow-lg shadow-black  items-center p-4 rounded-xl'>
          
          <h1 className='font-extrabold text-3xl my-2'> Camera Access Required</h1>
          
          <p className='text-xl my-2'>Please allow access to your camera to display the live feed</p>
          
          <div className='space-x-4'>
            <button 
            className="my-4 shadow-2xl bg-[#2563EB] shadow-md shadow-black w-fit p-2 md:w-40 rounded-full text-xl font-bold"
            onClick={()=>{startCamera(), setShowPrompt(!showPrompt)}} disabled={cameraOn}>
              Start Camera
            </button>
        
        </div>
      </div>
      }
         
      
      {
        cameraOn &&
        
         <div className='flex flex-col md:flex-row'>
            <div className="flex flex-col ">
         
              <div className='flex flex-row'>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="rounded-md server mr-auto w-1/2 md:w-1/4 md:h-fit"
                />

                <div className='flex flex-col mx-auto w-3/4 space-y-4 '>
                  <br />
                  <div className='flex flex-row'>
                  <br />
                    <button 
                    disabled={isOn}
                    className="bg-[#2563EB] w-1/2 md:w-1/4 mx-1 md:mx-4 rounded-lg text-sm md:text-lg text-white font-bold">
                      Sensor-On
                    </button>
                    <button
                    disabled={isOn}
                    className="bg-[#2563EB] w-1/2 md:w-1/4 mx-1 md:mx-4 rounded-lg text-sm md:text-lg text-white font-bold">
                      Sensor-Off
                    </button>
                  </div>

                  <div className='flex flex-row'>
                    <button
                    className="bg-[#2563EB] w-1/2 md:w-1/4 mx-1 md:mx-4 rounded-lg text-sm md:text-lg text-white font-bold">
                      Reset
                    </button>
                    <button
                    onClick={toggle}
                    className={`px-2 py-2 text-white ml-4 w-1/2 md:w-1/4 text-xs md:text-lg font-bold rounded-lg transition-colors ${
                      isOn ? 'bg-green-700' : 'bg-red-700'
                    }`}
                  >
                    {isOn ? 'HARDWARE ON' : 'HARDWARE OFF'}
                  </button>
                  </div>

                  <button className="bg-[#2563EB] w-1/2 mx-12 md:mx-6 
                rounded-lg text-lg text-white font-bold" onClick={()=>(stopCamera(), setShowPrompt(!showPrompt))} disabled={!cameraOn}>
                  Finish
                </button>
                </div>
               
                </div>

                <div className='flex flex-col md:flex-row'>
                <img
                  ref={receiveRef}
                  className="bg-neutral-700  w-3/4 h-[500px] my-2 object-cover rounded-md border-2 w-screen flex flex-wrap"
                />

                  <div className='mx-auto sm:mx-2 md:ml-6 bg-neutral-700 w-full md:w-1/5 
                   rounded-xl shadow-lg overflow-y-auto item text-left
                   shadow-black p-2 h-[250px] md:h-[450px] my-auto 
                   '>

                    <h1 className='font-bold text-white text-2xl md:text-3xl text-center font-extrabold my-2'>Item List</h1>
                    <h1 className='text-white text-center text-md md:text-2xl font-bold flex-wrap'>Count: {items.length}</h1>
                    {
                        items.length > 0 ? (
                            items.map((item, index) => (
                              <div key={index+1} className='text-white font-semibold text-xl lg:text-2xl p-1'>
                                <h1>
                                  {index+1}.
                                  {item['object_name']} 
                                  </h1>
                                <h1 className='ml-2'><span className='font-normal text-xl'>EXPIRY:</span> {item['expiry']}</h1>
                                <h1 className='ml-2'><span className='font-normal text-xl'>MFG:</span>{item['mfg']}</h1>
                                <h1 className='ml-2'><span className='font-normal text-xl'>BATCH NO:</span>{item['batch_no']}</h1>
                              </div>
                            )
                          )
                            ) : (
                                <p className='text-xl my-2 text-white'>No items received yet.</p>
                            )
                    }

                 
                </div>
                </div>
            </div>

            <canvas ref={canvasRef} style={{ display: 'none' }} />

               
          </div>
      }
    </div>
  );
};

export default Fruits;
