import { useState, useEffect, useRef } from "react";

const useVoiceSearch = (language = "vi-VN") => {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    // Kiểm tra xem trình duyệt có hỗ trợ Speech Recognition không
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      setIsSupported(true);

      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();

      // Cấu hình Speech Recognition
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = language;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        setError(null);
      };

      recognition.onresult = (event) => {
        const speechResult = event.results[0][0].transcript;
        setTranscript(speechResult);
        setIsListening(false);
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);

        let errorMessage = "";
        switch (event.error) {
          case "no-speech":
            errorMessage = "Không phát hiện giọng nói. Vui lòng thử lại.";
            break;
          case "audio-capture":
            errorMessage =
              "Không thể truy cập microphone. Vui lòng kiểm tra thiết bị.";
            break;
          case "not-allowed":
            errorMessage =
              "Quyền truy cập microphone bị từ chối. Vui lòng cho phép truy cập.";
            break;
          case "network":
            errorMessage = "Lỗi kết nối mạng. Vui lòng kiểm tra internet.";
            break;
          case "service-not-allowed":
            errorMessage = "Dịch vụ nhận diện giọng nói không khả dụng.";
            break;
          default:
            errorMessage = "Có lỗi xảy ra khi nhận diện giọng nói.";
        }
        setError(errorMessage);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [language]);

  const startListening = () => {
    if (recognitionRef.current && isSupported && !isListening) {
      setTranscript("");
      setError(null);
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  const resetTranscript = () => {
    setTranscript("");
    setError(null);
  };

  return {
    isListening,
    isSupported,
    transcript,
    error,
    startListening,
    stopListening,
    resetTranscript,
  };
};

export default useVoiceSearch;
