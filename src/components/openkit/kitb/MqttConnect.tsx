import { Dispatch, SetStateAction, useState } from "react";
import cryptoRandomString from "crypto-random-string";
import mqtt from "mqtt";

type MqttConnectProps = {
  setLight: Dispatch<SetStateAction<number>>;
  setGas: Dispatch<SetStateAction<number>>;
  setHumidity: Dispatch<SetStateAction<number>>;
  setTemperature: Dispatch<SetStateAction<number>>;
  setConnectStatus: Dispatch<SetStateAction<boolean>>;
  setLed: Dispatch<SetStateAction<number>>;
  connectStatus: boolean;
};

const MqttConnect = ({
  setTemperature,
  setGas,
  setHumidity,
  setLight,
  setConnectStatus,
  setLed,
  connectStatus,
}: MqttConnectProps) => {

  const [mqttHost, setMqttHost] = useState("openlab.com.vn");
  const [mqttPort, setMqttPort] = useState("8884");

  const [mqttUser, setMqttUser] = useState("");
  const [mqttPassword, setMqttPassword] = useState("");
  const [mqttTopicPub, setMqttTopicPub] = useState("");
  const [mqttMessage, setMqttMessage] = useState("");

  const [mqttTopicSub, setMqttTopicSub] = useState("");
  const [subscribedData, setSubscribedData] = useState("");
  const [client, setClient] = useState<mqtt.MqttClient | null>(null);
  const [subscribeStatus, setSubscribeStatus] = useState<string>("");
  const [publishStatus, setPublishStatus] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleConnect = async () => {
    if (!mqttHost || !mqttPort || !mqttUser || !mqttPassword) {
      setErrorMessage("Missing required parameter!");
      return;
    }
    setErrorMessage("");
    const id = cryptoRandomString({ length: 10 })
    const clientId = `mqttjs_${id}`;
    try {
      const mqttClient = mqtt.connect(
        `wss://${mqttHost}:${mqttPort}/mqtt`,
        {
          clientId,
          username: mqttUser,
          password: mqttPassword,
        }

      );

      if (mqttClient) {
        setClient(mqttClient);

        mqttClient.on("connect", () => {
          if (mqttClient.connected) {
            setConnectStatus(true);
            console.log("Connected");
            setMqttTopicSub(`${mqttUser}/`)
            setMqttTopicPub(`${mqttUser}/`)
          }
        });

        mqttClient.on("message", (_topic, message) => {
          try {
            const data = JSON.parse(message.toString());
            const temperatureValue = (data.temperature ?? "N/A").toFixed(2);
            const humidityValue = (data.humidity ?? "N/A").toFixed(2);
            const gasValue = (data.gas ?? "N/A").toFixed(2);
            const lightValue = (data.light ?? "N/A").toFixed(2);
            const ledValue = (data.led ?? "N/A");
            console.log("Received message: ", ledValue);
            setSubscribedData(JSON.stringify(data, null, 2));

            setTemperature(temperatureValue);
            setHumidity(humidityValue);
            setGas(gasValue);
            setLight(lightValue);
            setLed(ledValue)
            // const now = new Date().toLocaleTimeString();
            // setTimestamps((prev) => [...prev, now]);
          } catch (error) {
            console.error("Error parsing JSON:", error);
          }
        });

        mqttClient.on("error", (error) => {
          console.error("Connection error:", error);
          setConnectStatus(false);
          setClient(null);
        });
      } else {
        setErrorMessage("Failed to create MQTT client.");
      }
    } catch (error) {

      setErrorMessage(`Connection failed: ${error}`);
      console.log("Error connecting:", error);
    }
  };

  const handleDisconnect = () => {
    if (client) {
      client.end();
      setMqttTopicSub("");
      setMqttTopicPub("");
      console.log("Disconnected");
      setSubscribeStatus("");
      setSubscribedData("");
      setClient(null);
      setConnectStatus(false);
    }
  };

  const handleSubscribe = () => {
    if (client && client.connected) {
      console.log("Subscribed");
      client.subscribe(mqttTopicSub, { qos: 0 }, (error) => {
        if (error) {
          console.error("Subscribe error:", error);
          setSubscribeStatus("Subscription failed");
        } else {
          setSubscribeStatus("Subscription successful");
        }
      });
    }
  };

  const handleUnsubscribe = () => {
    if (client && connectStatus && mqttTopicSub) {
      client.unsubscribe(mqttTopicSub, (error) => {
        if (error) {
          console.error("Unsubscribe error:", error);
        } else {
          setSubscribedData("");
          setSubscribeStatus("Unsubscription successful");
        }
      });
    }
  };

  const handlePublish = () => {
    if (client && connectStatus && mqttTopicPub && mqttMessage) {
      const message = JSON.stringify({ mqttMessage });
      client.publish(
        mqttTopicPub,
        message,
        { qos: 0, retain: false },
        (error) => {
          if (error) {
            console.error("Publish error:", error);
            setPublishStatus("Publish failed");
          } else {
            setPublishStatus("Publish successful");
          }
        }
      );
    }
  };


  return (
    <div>
      <div className="flex flex-col bg-[#eee] p-16  ">
        <h2 className="text-center text-4xl font-semibold py-4">MQTT Controls</h2>
        <div className="flex items-center justify-around  gap-4">
          <div className="flex flex-col px-6 py-4 rounded-md bg-white w-1/3 gap-4">
            <h1 className="text-center font-semibold text-xl">Connect</h1>

            <div className="flex justify-between items-center">
              <label>ID-KIT:</label>
              <input
                value={mqttUser}
                type="text"
                className="px-3 py-2 rounded-sm bg-[#eee] focus:bg-white w-[65%]"
                placeholder="Enter username"
                onChange={(e) => setMqttUser(e.target.value)}
              />
            </div>

            <div className="flex justify-between items-center">
              <label>Password:</label>
              <input
                type="password"
                value={mqttPassword}
                className="px-3 py-2 rounded-sm bg-[#eee] focus:bg-white w-[65%]"
                placeholder="Enter password"
                onChange={(e) => setMqttPassword(e.target.value)}
              />
            </div>

            <div className="flex justify-between items-center">
              <label>Host:</label>
              <input
                value={mqttHost}
                type="text"
                className="px-3 py-2 rounded-sm bg-[#eee] focus:bg-white w-[65%]"
                placeholder="Enter host address"
                onChange={(e) => setMqttHost(e.target.value)}
              />
            </div>

            <div className="flex justify-between items-center">
              <label>Port:</label>
              <input
                value={mqttPort}
                type="text"
                className="px-3 py-2 rounded-sm bg-[#eee] focus:bg-white w-[65%]"
                placeholder="Enter port"
                onChange={(e) => setMqttPort(e.target.value)}
              />
            </div>

            <div className="flex justify-around items-center">
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
              <p className="text-red-600 text-center">Connected</p>
            ) : (
              <p className="text-red-600 text-center">Disconnected</p>
            )}
            {errorMessage && (
              <p className="text-center text-red-600">{errorMessage}</p>
            )}
          </div>

          <div className="bg-yellow-50 flex rounded-md flex-col gap-4 px-6 py-4 w-1/3 h-96">
            <h1 className="text-center font-semibold text-xl">Subcribe</h1>
            <div className="flex justify-between items-center">
              <label>Topic:</label>
              <input
                value={mqttTopicSub}
                type="text"
                className="px-3 py-2 rounded-sm bg-[#eee] focus:bg-white w-[60%]"
                placeholder="Enter topic"
                onChange={(e) => setMqttTopicSub(e.target.value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <h3>Data</h3>
              <textarea
                name="message"
                minLength={142}
                readOnly
                className="w-[60%] h-36"
                value={subscribedData}
              />
            </div>

            <div className="flex items-center justify-around">
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

          <div className="bg-blue-100 rounded-md flex items-center flex-col gap-5 px-5 py-4 w-1/3 h-96" >
            <h1 className="text-center font-semibold text-xl">Publish</h1>
            <div className="flex items-center justify-between w-full">
              <label>Topic:</label>
              <input
                value={mqttTopicPub}
                type="text"
                className="px-3 py-2 rounded-sm bg-[#eee] focus:bg-white w-[60%]"
                placeholder="Enter topic"
                onChange={(e) => setMqttTopicPub(e.target.value)}
              />
            </div>
            <div className="flex items-center justify-between w-full">
              <label>Message:</label>
              <textarea
                name="message"
                minLength={142}
                value={mqttMessage}
                className="w-[60%] h-36 px-3 py-2"
                placeholder="Enter message"
                onChange={(e) => setMqttMessage(e.target.value)}
              />
            </div>

            <button
              className="w-full py-3 rounded bg-green-500 text-white"
              onClick={handlePublish}
            >
              Publish
            </button>

            <div>
              <p className="text-center text-red-600">{publishStatus}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MqttConnect;
