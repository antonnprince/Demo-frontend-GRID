import React, { useRef, useState } from 'react';

const CameraAccess = () => {
  const videoRef = useRef(null);
  const receiveRef = useRef(null)
  const [cameraOn, setCameraOn] = useState(false);
  const canvasRef = useRef(null); 
    const[items, setItems] = useState([])

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
            // setCameraOn(false)
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
    <div className=''>
      {/*   <h1>Camera Access in React</h1> */}
      <div className='flex flex-col items-center space-y-8 p-4'>
        <button 
        className="bg-[#2563EB] w-40 rounded-lg text-2xl font-bold"
        onClick={startCamera} disabled={cameraOn}>
          Start Camera
        </button>
        <button className="bg-[#2563EB] w-40 rounded-lg text-2xl font-bold" onClick={stopCamera} disabled={!cameraOn}>
          Stop Camera
        </button>
      </div>
      
      <div>

        <video ref={videoRef} autoPlay playsInline width="400" height="300" />
        

        <img ref={receiveRef} autoPlay playsInline width="400" height="300"/>
        <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
      
        {items.length > 0 ? (
                items.map((item, index) => <h1 key={index}>{item}</h1>)
            ) : (
                <p>No items received yet.</p>
            )}
        
      </div>

    
    </div>
  );
};

export default CameraAccess;
