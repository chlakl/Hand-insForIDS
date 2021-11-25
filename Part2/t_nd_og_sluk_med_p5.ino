const int LED_PIN = 27; 

void setup() {
  Serial.begin(9600);
  pinMode(LED_PIN, OUTPUT);
}

void loop() {
  int brightness;
  // If statement til at checke hvorvidt der er sendt noget fra p5js:
  if (Serial.available() > 0) {
    // Læs data sendt via p5js scriptet:
    brightness = Serial.read();
    // Juster lysstyrke:
    digitalWrite(LED_PIN, brightness);
  }

}
