#define button 4


int buttonLastState = 0;
int outputState = 0;
uint8_t      btnCnt = 1;


int button_state = 0;
int potentiometer = A0;
int light_sensor = A3;
int sensors[3];

void setup() {
   // start serial port at 9600 bps:
   Serial.begin(9600);
   pinMode(button, INPUT);
   pinMode(potentiometer,INPUT);
   
}
 
void loop() {

  
  button_state = digitalRead(button);


//   tried to have a toggle button but couldn't get it to run in serial print
//  if (buttonLastState == LOW && button_state == HIGH)
//  {
//     outputState = !outputState; // Change outputState
//  }
//  buttonLastState = button_state; //Set the button's last state
//
//   // Print the output
//  if (outputState)
// {
//      switch (btnCnt++) {
//        case 100:
//        
//         digitalWrite(sensors[0],HIGH); // after 10s turn on
//         break;
//
//       case 200:
//         digitalWrite(sensors[0], LOW); // after 20s turn off
//         break;
//
//       case 202: // small loop at the end, to do not repeat the LED cycle
//         btnCnt--;
//         break;    
//       }
//
//       button_state==1;
//  }else{
//    button_state==0;
//    if (btnCnt > 0) {  
//       // disable all:
//
//       digitalWrite(button_state,LOW);
//    }
//    btnCnt = 0;
//  }
//




    sensors[0] = button_state;
    
    int sensor_value = analogRead(potentiometer);
    int value = map(sensor_value, 0, 1023, 0, 100);
    
    sensors[1] = sensor_value;
    
    int raw_light = analogRead(light_sensor);
    int light = map(raw_light, 0, 1023, 0, 100);
    
    sensors[2] = light;

    
    if (button_state == HIGH){
        
      }


    
    for (int thisSensor = 0; thisSensor < 3; thisSensor++) {

        int sensorValue = sensors[thisSensor];
      
      // if you're on the last sensor value, end with a println()
      // otherwise, print a comma
      //The number of sensors needs to be hard coded, in this example 3 sensors are running 0,1,2
      
      Serial.print(sensorValue);
      if (thisSensor == 2) {
         Serial.println();
      } else {
         Serial.print(",");
      }
   }
    delay(100);              
}
