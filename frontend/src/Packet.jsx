import React, { useRef, useState, useEffect } from 'react';

const Packet = () => {
  const videoRef = useRef(null);
  const receiveRef = useRef(null)
  const [showPrompt, setShowPrompt] = useState(true)
  const [cameraOn, setCameraOn] = useState(false);
  const canvasRef = useRef(null); 
    const[items, setItems] = useState([])


    useEffect(()=>{
        
    })


    const test = [
      {
      'expiry':'10/02/34',
      'mfg':'10/02/10',
      'batch_no':'18362784fefhei',
      'object_name':'Pineapple'
      },
      {
        'expiry':'10/02/34',
        'mfg':'10/02/10',
        'batch_no':18362784,
        'object_name':'Test 1'
        },
        {
          'expiry':'10/02/34',
          'mfg':'10/02/10',
          'batch_no':18362784,
          'object_name':'Test 1'
          },
          {
            'expiry':'10/02/34',
            'mfg':'10/02/10',
            'batch_no':18362784,
            'object_name':'Test 1'
            },
            {
              'expiry':'10/02/34',
              'mfg':'10/02/10',
              'batch_no':18362784,
              'object_name':'Test 1'
              },
  ]


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

  //   async function sendFeedToServer(video) {
  //     const canvas = document.createElement('canvas');
  //     const context = canvas.getContext('2d');
  
  //     let feedwebsocket, objectwebsocket;
  //     const reconnectInterval = 500; // 500 ms
  
  //     function connectFeedWebSocket() {
  //         feedwebsocket = new WebSocket(wss://${host}/ws/camera_feed_expiry);
          
  //         feedwebsocket.onopen = () => {
  //             console.log('Feed WebSocket connected');
  //             setInterval(() => {
  //                 if (video.readyState === 4 && video.videoWidth && video.videoHeight) {
  //                     canvas.width = video.videoWidth;
  //                     canvas.height = video.videoHeight;
  //                     context.drawImage(video, 0, 0, canvas.width, canvas.height);
  //                     const imageData = canvas.toDataURL('image/jpeg'); // Capture frame as JPEG
  
  //                     // Send the image data to the WebSocket server
  //                     if (feedwebsocket.readyState === WebSocket.OPEN) {
  //                         feedwebsocket.send(imageData);
  //                     }
  //                 }
  //             }, 150); // Capture and send at a delay
  //         };
  
  //         feedwebsocket.onerror = (error) => {
  //             console.error('Feed WebSocket error:', error);
  //         };
  
  //         feedwebsocket.onclose = () => {
  //             console.log('Feed WebSocket connection closed. Reconnecting...');
  //             setTimeout(connectFeedWebSocket, reconnectInterval);
  //         };
  
  //         feedwebsocket.onmessage = (event) => {
  //             // Set the source of the img element to the received image
  //             const imageFeed = document.getElementById('cameraFeed');
  //             imageFeed.src = event.data; // Set the source to the received image
  //         };
  //     }
  
  //     function connectObjectWebSocket() {
  //         objectwebsocket = new WebSocket(wss://${host}/ws/packed_products_expiry);
  
  //         objectwebsocket.onopen = () => {
  //             console.log("Object WebSocket connected");
  //         };
  
  //         objectwebsocket.onerror = (error) => {
  //             console.error("Object WebSocket error:", error);
  //         };
  
  //         objectwebsocket.onclose = () => {
  //             console.log("Object WebSocket connection closed. Reconnecting...");
  //             setTimeout(connectObjectWebSocket, reconnectInterval);
  //         };
  
  //         objectwebsocket.onmessage = (event) => {
  //             const data = JSON.parse(event.data);
  //             console.log(data['details']);
  //             console.log("Product name:", data['product_name']);
  //             console.log("Name detection:", data['name_detection']);
  //             const count = data['count'];
  //             console.log("COUNT:", count);
  //             populateItemList(data['details']);
  //         };
  //     }
  
  //     // Initialize both WebSocket connections
  //     connectFeedWebSocket();
  //     connectObjectWebSocket();
  // }
    const sendFeedToServer =async(video)=>{
        let feedwebsocket = new WebSocket('wss://backend.angeloantu.online/ws/camera_feed_expiry');
        let countwebsocket = new WebSocket('wss://backend.angeloantu.online/ws/packed_products_expiry');
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        
        feedwebsocket.onopen = () => {
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
            console.error('feed WebSocket error:', error);
        };
        
        feedwebsocket.onclose = () => {
            console.log('feed WebSocket connection closed');
        };

        feedwebsocket.onmessage = (event) => {
            // Assuming event.data is a Base64 string
            const base64Image = event.data;
            receiveRef.current.src = base64Image;
        };
    
        countwebsocket.onerror = (error) => {
            console.log("object socket error", error)
        }
    
        countwebsocket.onclose = () => {
            console.log("object socket closed");
        }

        countwebsocket.onmessage = (event) => {
             console.log("items data :",event.data);
             try {
                const newItem = JSON.parse(event.data)
                setItems((prev)=>[...prev, newItem])
             } catch (error) {
                
             }
            
        }
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
            <div className="flex flex-col">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="border-2 border-white rounded-md server mr-auto w-1/2 md:w-1/4 md:h-fit"
                />
                
                <img
                  ref={receiveRef}
                  className="bg-neutral-700  w-3/4 h-[500px] my-2 object-cover rounded-md border-2 w-screen flex flex-wrap"
                />
            </div>

            <canvas ref={canvasRef} style={{ display: 'none' }} />

                <div className='mx-auto sm:mx-2 md:ml-6 bg-neutral-700 w-full md:w-1/5 
                   rounded-xl shadow-lg overflow-y-auto item text-left
                   shadow-black p-2 h-[250px] md:h-[400px] my-auto'>
                    <h1 className='font-bold text-white text-2xl md:text-3xl text-center font-extrabold my-2'>Item List</h1>
              {
                   test.length > 0 ? (
                      test.map((item, index) => (
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
              <button className="bg-[#2563EB] w-full rounded-full text-lg text-white font-bold" onClick={()=>(stopCamera(), setShowPrompt(!showPrompt))} disabled={!cameraOn}>
              Finish
            </button>
         </div>
          </div>
      }
    </div>
  );
};

export default Packet;
