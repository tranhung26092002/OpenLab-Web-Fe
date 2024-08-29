import { Dispatch, SetStateAction, useState } from "react";
import cryptoRandomString from "crypto-random-string";
import mqtt from "mqtt";
type MqttConnectProps = {
  setLight: Dispatch<SetStateAction<number>>;
  setGas: Dispatch<SetStateAction<number>>;
  setHumidity: Dispatch<SetStateAction<number>>;
  setTemperature: Dispatch<SetStateAction<number>>;
  setConnectStatus: Dispatch<SetStateAction<boolean>>;
  setTimestamps: Dispatch<SetStateAction<string[]>>;
  connectStatus: boolean;
};
const MqttConnect = ({
  setTemperature,
  setGas,
  setHumidity,
  setLight,
  setConnectStatus,
  setTimestamps,
  connectStatus,
}: MqttConnectProps) => {
  const [mqttProtocol, setMqttProtocol] = useState("wss://");
  const [mqttHost, setMqttHost] = useState("openlab.com.vn");
  const [mqttPort, setMqttPort] = useState("8884");
  const [mqttidKit, setIdKit] = useState("abc");
  const [mqttUser, setMqttUser] = useState("admin");
  const [mqttPassword, setMqttPassword] = useState("admin");
  const [mqttTopicPub, setMqttTopicPub] = useState("");
  const [mqttMessage, setMqttMessage] = useState("");
  const [mqttTopicSub, setMqttTopicSub] = useState("sensor");
  const [subscribedData, setSubscribedData] = useState("");
  const [client, setClient] = useState<mqtt.MqttClient | null>(null);
  const [subscribeStatus, setSubscribeStatus] = useState<string>("");
  const [publishStatus, setPublishStatus] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleConnect = async () => {
    if (!mqttHost || !mqttPort || !mqttidKit || !mqttUser || !mqttPassword) {
      setErrorMessage("Missing required parameter!.");
      return;
    }

    setErrorMessage("");
    const clientId = `mqttjs_${cryptoRandomString({ length: 10 })}`;
    try {
      const mqttClient = mqtt.connect(
        `${mqttProtocol}${mqttHost}:${mqttPort}/mqtt`,
        {
          clientId: clientId,
          username: mqttUser,
          password: mqttPassword,
        }
      );
      //  setConnectStatus(true);
      if (mqttClient) {
        setClient(mqttClient);
        mqttClient.on("connect", () => {
          if (mqttClient.connected) {
            setConnectStatus(true);
            console.log("Connectting...");
          }
        });

        mqttClient.on("message", (message) => {
          try {
            const data = JSON.parse(message.toString());
            console.log("check message: ", data);

            setSubscribedData(JSON.stringify(data, null, 3));

            const temperatureValue = data.temperature.toFixed(2);
            console.log(typeof temperatureValue, temperatureValue);
            const humidityValue = data.humidity.toFixed(2);
            const gasValue = data.gas.toFixed(2);
            const lightValue = data.light.toFixed(2);
            // const ledValue = data.led || "off";

            setTemperature(temperatureValue);
            setHumidity(humidityValue);
            setGas(gasValue);
            setLight(lightValue);
            // setLed(ledValue);

            const now = new Date().toLocaleTimeString();
            setTimestamps((prev) => [...prev, now]);
          } catch (error) {
            console.error("Error parsing JSON:", error);
          }
        });
        mqttClient.on("error", (error) => {
          console.error("Connection error: ", error);
          setConnectStatus(false);
          setClient(null);
        });
      } else {
        setClient(null);
      }
    } catch (error) {
      console.log("Error Connect is: ", error);
    }

    // setClient(mqttClient);
    // setConnectionStatus("Connecting...");
    // setErrorMessage("");
  };

  const handleDisconnect = () => {
    if (client) {
      client.end();
      console.log("Disconnectting...");
      setSubscribeStatus("");
      setSubscribedData("");
      setClient(null);
      setConnectStatus(false);
    }
  };

  const handleSubscribe = () => {
    try {
      if (client && client.connected) {
        console.log("Subscribing ...");
        client.subscribe(mqttTopicSub, { qos: 0 }, (error) => {
          if (error) {
            console.error("Subscribe error: ", error);
            setSubscribeStatus("Đăng kí thất bại");
          }
          setSubscribeStatus("Đăng kí thành công");
        });
      }
    } catch (error) {
      console.log("Error Subscribe is : ", error);
    }
  };

  const handleUnsubscribe = () => {
    if (client && connectStatus === true && mqttTopicSub) {
      client.unsubscribe(mqttTopicSub, (error) => {
        if (error) {
          console.error("Unsubscribe error: ", error);
        } else {
          setSubscribedData("");
          setSubscribeStatus("Unsubscribe Successful");
        }
      });
    }
  };

  const handlePublish = () => {
    if (client && connectStatus === true && mqttTopicPub && mqttMessage) {
      const message = JSON.stringify({ mqttidKit: mqttMessage });
      client.publish(
        mqttTopicPub,
        message,
        { qos: 0, retain: false },
        (error) => {
          if (error) {
            console.error("Publish error: ", error);
            setPublishStatus("Publish Failed");
          } else {
            setPublishStatus("Publish Successful");
          }
        }
      );
    }
  };

  return (
    <div>
      <div className="flex flex-col ">
        <h2 className=" text-center text-2xl font-medium">MQTT Controls</h2>
        <div className=" flex items-center justify-around p-16 gap-4">
          <div className="flex flex-col px-6 py-4 rounded-md bg-white w-1/3  gap-4">
            <div className=" flex justify-between items-center">
              <label htmlFor="id-kit">ID-KIT:</label>
              <input
                type="text"
                className="px-3 py-2 rounded-sm bg-[#eee] focus:bg-white w-[65%]"
                placeholder="Enter ID-Kit"
                id="id-kit"
                onChange={(e) => {
                  setIdKit(e.target.value);
                }}
              />
            </div>
            <div className=" flex justify-between items-center">
              <label>Protocol:</label>
              <select
                className="bg-[#eee] px-2 rounded-sm  py-2"
                onChange={(e) => {
                  setMqttProtocol(e.target.value);
                }}
              >
                <option value="mqtt://">mqtt://</option>
                <option value="mqtts://">mqtts://</option>
                <option value="ws://">ws://</option>
                <option value="wss://">wss://</option>
              </select>
            </div>
            <div className=" flex justify-between items-center">
              <label>Host:</label>
              <input
                type="text"
                className="px-3 py-2 rounded-sm bg-[#eee] focus:bg-white w-[65%]"
                placeholder="Enter host address"
                onChange={(e) => {
                  setMqttHost(e.target.value);
                }}
              />
            </div>
            <div className=" flex justify-between items-center">
              <label>Port:</label>
              <input
                type="text"
                className="px-3 py-2 rounded-sm bg-[#eee] focus:bg-white w-[65%]"
                placeholder="Enter port"
                onChange={(e) => {
                  setMqttPort(e.target.value);
                }}
              />
            </div>
            <div className=" flex justify-between items-center">
              <label>Username:</label>
              <input
                type="text"
                className="px-3 py-2 rounded-sm bg-[#eee] focus:bg-white w-[65%] "
                placeholder="Enter username"
                onChange={(e) => {
                  setMqttUser(e.target.value);
                }}
              />
            </div>
            <div className=" flex justify-between items-center">
              <label>Password:</label>
              <input
                className="px-3 py-2 rounded-sm bg-[#eee] focus:bg-white w-[65%]"
                type="password"
                placeholder="Enter password"
                onChange={(e) => {
                  setMqttPassword(e.target.value);
                }}
              />
            </div>
            <div className=" flex justify-around items-center">
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded"
                onClick={handleConnect}
              >
                Connect
              </button>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded"
                onClick={handleDisconnect}
              >
                Disconnect
              </button>
            </div>
            {connectStatus ? (
              <p className="text-red-600 text-center">Đang kết nối</p>
            ) : (
              <p className="text-red-600 text-center">Đang ngắt nối</p>
            )}
            {errorMessage && <p>{errorMessage}</p>}
          </div>

          <div className=" bg-yellow-50 flex rounded-md flex-col gap-4 px-6 py-4 w-1/3 ">
            <h1 className="text-center font-medium">Subscribed</h1>
            <div className=" flex justify-between items-center">
              <label>Topic:</label>
              <input
                type="text"
                className="px-3 py-2 rounded-sm bg-[#eee] focus:bg-white w-[60%]"
                placeholder="Enter topic"
                defaultValue={mqttTopicSub}
                onChange={(e) => {
                  setMqttTopicSub(e.target.value);
                }}
              />
            </div>
            <div className=" flex items-center justify-between">
              <h3>Data</h3>
              <textarea
                name="message"
                readOnly
                className="w-[60%] h-20"
                value={subscribedData}
              />
            </div>
            <div className=" flex items-center justify-around">
              <button
                className="px-3 py-2 bg-yellow-400 text-white rounded"
                onClick={handleSubscribe}
              >
                Subscribe
              </button>
              <button
                className="px-3 py-2 bg-yellow-400 text-white rounded"
                onClick={handleUnsubscribe}
              >
                Unsubscribe
              </button>
            </div>
            <div>
              <p className="text-center text-red-600">{subscribeStatus}</p>
            </div>
          </div>

          <div className=" bg-blue-100 rounded-md flex items-center flex-col gap-5 px-5 py-4 w-1/3">
            <h1 className="text-center font-medium">Publish</h1>
            <div className=" flex items-center justify-between w-full">
              <label>Topic:</label>
              <input
                type="text"
                className="px-3 py-2 rounded-sm bg-[#eee] focus:bg-white "
                placeholder="Enter topic"
                onChange={(e) => {
                  setMqttTopicPub(e.target.value);
                }}
              />
            </div>
            <div className="flex items-center justify-between w-full">
              <label>Message:</label>
              <input
                type="text"
                className="px-3 py-2 rounded-sm bg-[#eee] focus:bg-white "
                onChange={(e) => {
                  setMqttMessage(e.target.value);
                }}
                placeholder="Enter message"
              />
            </div>
            <button
              className="w-full py-3 rounded bg-green-500 text-white"
              onClick={handlePublish}
            >
              Publish
            </button>
            <div>
              <p>{publishStatus}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MqttConnect;
