import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from "../components/header/header.component";
import { FooteComponent } from "../components/foote/foote.component";

@Component({
  selector: 'app-voice-chat',
  standalone: true,
  imports: [CommonModule, HttpClientModule, HeaderComponent, FooteComponent],
  templateUrl: './voice-chat.component.html',
  styleUrls: ['./voice-chat.component.css']
})
export class VoiceChatComponent {
  messages: { sender: string, text: string }[] = [];
  isListening: boolean = false;
  recognition: any;
  apiUrl = 'http://localhost:8000/api/voice/echo/'; // Django API
  speechError: string = '';
  isSupported: boolean = false;

  // Alternative speech recognition method
  private initializeAlternativeSpeechRecognition() {
    // Try using MediaRecorder + Web Speech API as fallback
    if (navigator.mediaDevices && 'MediaRecorder' in window) {
      console.log('Alternative speech recognition available');
      
      navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
        const mediaRecorder = new MediaRecorder(stream);
        const chunks: any[] = [];
        
        mediaRecorder.ondataavailable = (event) => {
          chunks.push(event.data);
        };
        
        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(chunks, { type: 'audio/webm' });
          console.log('Audio recorded, trying to process...');
          
          // Try to send audio to backend for processing
          this.processAudioBlob(audioBlob);
        };
        
        // Store for later use
        (this as any).mediaRecorder = mediaRecorder;
        (this as any).audioStream = stream;
        
      }).catch(err => {
        console.error('Alternative method failed:', err);
      });
    }
  }

  // Process audio blob
  private processAudioBlob(audioBlob: Blob) {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.webm');
    
    this.http.post<any>(this.apiUrl, formData).subscribe({
      next: (res) => {
        console.log('Audio processed:', res);
        if (res.answer) {
          this.messages.push({ sender: 'AI', text: res.answer });
        }
      },
      error: (err) => {
        console.error('Audio processing error:', err);
        this.speechError = 'Audio processing failed. Please try typing instead.';
      }
    });
  }

  // Start alternative recording
  startAlternativeRecording() {
    if ((this as any).mediaRecorder) {
      const mediaRecorder = (this as any).mediaRecorder;
      const stream = (this as any).audioStream;
      
      if (mediaRecorder.state === 'inactive') {
        mediaRecorder.start();
        this.isListening = true;
        console.log('Alternative recording started...');
        
        // Stop after 5 seconds
        setTimeout(() => {
          if (mediaRecorder.state === 'recording') {
            mediaRecorder.stop();
            this.isListening = false;
            console.log('Alternative recording stopped.');
          }
        }, 5000);
      }
    }
  }

  constructor(private http: HttpClient) {
    this.initializeSpeechRecognition();
    this.initializeAlternativeSpeechRecognition();
  }

  private initializeSpeechRecognition() {
    // Check if speech recognition is supported
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      this.isSupported = true;
      this.recognition = new SpeechRecognition();
      
      // Try different configurations for better speech detection
      this.recognition.lang = 'en-US';
      this.recognition.continuous = false;
      this.recognition.interimResults = false; // Try without interim results
      this.recognition.maxAlternatives = 1; // Try with single alternative
      
      // Add additional configuration for better detection
      if (this.recognition.grammars !== undefined) {
        // Some browsers support grammar specification
        console.log('Grammar support available');
      }
      
      // Event handlers
      this.recognition.onstart = () => {
        console.log('Speech recognition started');
        this.isListening = true;
        this.speechError = '';
      };

      this.recognition.onresult = (event: any) => {
        console.log('Speech recognition result event:', event);
        
        if (event.results && event.results.length > 0) {
          const transcript = event.results[0][0].transcript;
          const confidence = event.results[0][0].confidence;
          console.log('Voice detected:', transcript, 'Confidence:', confidence);
          
          this.isListening = false;
          this.sendTextToBackend(transcript);
        }
      };

      this.recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event);
        console.error('Error details:', {
          error: event.error,
          message: event.message,
          timeStamp: event.timeStamp
        });
        
        this.isListening = false;
        
        // Handle different error types
        switch (event.error) {
          case 'no-speech':
            this.speechError = 'No speech detected. This might be a browser issue. Try refreshing the page or using a different browser.';
            break;
          case 'audio-capture':
            this.speechError = 'Microphone access denied. Please check your microphone permissions.';
            break;
          case 'not-allowed':
            this.speechError = 'Microphone access denied. Please allow microphone access and try again.';
            break;
          case 'network':
            this.speechError = 'Network error. Please check your internet connection.';
            break;
          case 'aborted':
            this.speechError = 'Speech recognition was aborted.';
            break;
          case 'service-not-allowed':
            this.speechError = 'Speech recognition service not allowed.';
            break;
          case 'bad-grammar':
            this.speechError = 'Bad grammar in speech.';
            break;
          case 'language-not-supported':
            this.speechError = 'Language not supported.';
            break;
          default:
            this.speechError = `Speech recognition error: ${event.error}`;
        }
        
        // Clear error after 5 seconds
        setTimeout(() => {
          this.speechError = '';
        }, 5000);
      };

      this.recognition.onend = () => {
        console.log('Speech recognition ended');
        this.isListening = false;
      };

      this.recognition.onspeechend = () => {
        console.log('Speech ended');
        this.recognition.stop();
      };
      
      // Add additional event handlers for better debugging
      this.recognition.onaudiostart = () => {
        console.log('Audio capturing started');
      };
      
      this.recognition.onaudioend = () => {
        console.log('Audio capturing ended');
      };
      
      this.recognition.onsoundstart = () => {
        console.log('Sound detected');
      };
      
      this.recognition.onsoundend = () => {
        console.log('Sound ended');
      };
      
      this.recognition.onspeechstart = () => {
        console.log('Speech started');
      };
      
      this.recognition.onspeechend = () => {
        console.log('Speech ended');
        this.recognition.stop();
      };
      
    } else {
      this.isSupported = false;
      this.speechError = 'Speech recognition is not supported in this browser.';
    }
  }

  // Check microphone permissions
  async checkMicrophonePermission() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop()); // Stop the stream immediately
      return true;
    } catch (error: any) {
      console.error('Microphone permission error:', error);
      if (error.name === 'NotAllowedError') {
        this.speechError = 'Microphone access denied. Please allow microphone access in your browser settings and refresh the page.';
      } else if (error.name === 'NotFoundError') {
        this.speechError = 'No microphone found. Please connect a microphone and try again.';
      } else {
        this.speechError = 'Microphone error: ' + error.message;
      }
      return false;
    }
  }

  // Test microphone and provide user guidance
  async testMicrophone() {
    try {
      console.log('Testing microphone...');
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });
      
      // Create a simple audio context to test audio levels
      const audioContext = new (window as any).AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      source.connect(analyser);
      
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      
      // Check audio levels for a few seconds
      let audioDetected = false;
      const checkAudio = () => {
        analyser.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
        
        if (average > 10) { // Threshold for audio detection
          audioDetected = true;
          console.log('Audio detected! Level:', average);
        }
      };
      
      // Check audio levels every 100ms for 3 seconds
      const audioCheckInterval = setInterval(checkAudio, 100);
      setTimeout(() => {
        clearInterval(audioCheckInterval);
        stream.getTracks().forEach(track => track.stop());
        audioContext.close();
        
        if (audioDetected) {
          this.speechError = 'Microphone is working! Try speaking again.';
        } else {
          this.speechError = 'No audio detected. Please check your microphone and speak louder.';
        }
        
        setTimeout(() => {
          this.speechError = '';
        }, 5000);
      }, 3000);
      
      return true;
    } catch (error: any) {
      console.error('Microphone test failed:', error);
      this.speechError = 'Microphone test failed: ' + error.message;
      return false;
    }
  }

  // Start/stop text-based recognition
  async startListening() {
    if (!this.isSupported) {
      this.speechError = 'Speech recognition is not supported in this browser.';
      return;
    }

    // Check microphone permission first
    const hasPermission = await this.checkMicrophonePermission();
    if (!hasPermission) {
      return;
    }

    if (this.recognition) {
      try {
        this.speechError = '';
        this.isListening = true;
        
        // Test microphone before starting recognition
        await this.testMicrophone();
        
        this.recognition.start();
        console.log('Listening started...');
        
        // Add a timeout to stop listening if no speech is detected
        setTimeout(() => {
          if (this.isListening) {
            this.recognition.stop();
            this.speechError = 'No speech detected. Please try again. Make sure to speak clearly and loudly.';
          }
        }, 15000); // Increased to 15 seconds
      } catch (error) {
        console.error('Error starting speech recognition:', error);
        this.speechError = 'Error starting speech recognition. Please try again.';
        this.isListening = false;
      }
    }
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      this.isListening = false;
      this.recognition.stop();
      console.log('Listening stopped.');
    }
  }

  // Clear speech error
  clearSpeechError() {
    this.speechError = '';
  }

  // Send transcript to backend as text
  sendTextToBackend(transcript: string) {
    if (!transcript.trim()) return;

    this.messages.push({ sender: 'You', text: transcript });
    console.log('Sending text to backend:', transcript);

    // Set proper headers for JSON request
    const headers = { 'Content-Type': 'application/json' };
    
    this.http.post<any>(this.apiUrl, { question: transcript }, { headers }).subscribe({
      next: (res) => {
        console.log('Received response:', res);
        if (res.answer) {
          this.messages.push({ sender: 'AI', text: res.answer });
        } else {
          this.messages.push({ sender: 'AI', text: 'Received response but no answer field found.' });
        }
      },
      error: (err) => {
        console.error('Backend error:', err);
        let errorMessage = 'Sorry, something went wrong.';
        
        if (err.error && err.error.error) {
          errorMessage = err.error.error;
        } else if (err.status === 400) {
          errorMessage = 'Bad request - please check your input.';
        } else if (err.status === 404) {
          errorMessage = 'Endpoint not found.';
        } else if (err.status === 500) {
          errorMessage = 'Server error.';
        }
        
        this.messages.push({ sender: 'AI', text: errorMessage });
      }
    });
  }

  // Record raw audio and send to backend
  startRecording() {
    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
      const mediaRecorder = new (window as any).MediaRecorder(stream);
      const chunks: any[] = [];

      mediaRecorder.ondataavailable = (event: any) => chunks.push(event.data);

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: 'audio/webm' });
        const formData = new FormData();
        formData.append('audio', audioBlob, 'recording.webm');

        this.http.post<any>(this.apiUrl, formData).subscribe({
          next: (res) => console.log('Echo received from backend:', res.audio),
          error: (err) => console.error('Backend error:', err)
        });
      };

      mediaRecorder.start();
      console.log('Recording started...');
      setTimeout(() => {
        mediaRecorder.stop();
        console.log('Recording stopped.');
      }, 5000); // record 5 seconds
    }).catch(err => console.error('Microphone access denied:', err));
  }
}
