# AI20_StoryGeneratorFromImage
I. Project Overview
Title of the project:
AI Powered Story Generator for Kids Using Image as Input
Problem statement: 
We provide a AI-driven story generator which takes images as output and produce stories which are imaginative and kid-friendly In this generation kids are used to like creativity more. This will help to give stories which kids can understand easily. This gives kids friendly stories based on the images provided as output.
Objectives:
•	Use NLP models to generate a creative coherent story.
•	Extract relevant elements from the input images.
Goals:
•	Its main goal is to provide kids the creative stories from which they can think creatively.
•	To provide stories in easy language so that they can understand easily.
Key points:
•	To give story from input images.
Targeted audience:
•	Kids between the age of 5 to 12 years.
•	Kids are targeted audience they will get creative stories by giving images as input.

II. Technology Stack:
Frontend: HTML, CSS, JavaScript
Backend: Flask
Programing languages: Python 3.12.3
Machine Learning Models:
YOLOv5
•	A state-of-the-art, pre-trained deep learning model for object detection.
•	Used to detect objects in uploaded images.
 GPT-2 
•	A transformer-based language model by OpenAI for generating human-like text.
•	Generates creative stories based on detected objects.
 

III. System Requirements:
Hardware Requirements: System or Laptop with Processor, RAM, CPU, OS
Software Requirements: 
	Python – version 3.8 or higher
	Flask, torch, torchvision, ultralytics, transformers, opencv-python, numpy
III. System Requirements:
Hardware Requirements: System or Laptop with Processor, RAM, CPU, OS
Software Requirements: 
	Python – version 3.8 or higher
	Flask, torch, torchvision, ultralytics, transformers, opencv-python, numpy

IV. Installation and Setup Instructions:
•	Install all the dependencies using “pip install” command
•	Set up the flask app to render html page
•	Run the application using “python app.py” command

V. Features Explanation:
Object Detection: The primary goal is to detect object form images provided. The Yolov5 is used to perform this.
Story generation: The detected objects are then used to trigger a prompt for the text generator GPT2 model to generate required story.
Web interface: The user interface for this is rendered on flask application
VI. Code structure:
|-Story_Generator
	|-app.py
	|-yolo.py
	|-model
	     |-yolov5.pt
	|-static
	|-templates
	     |-index.html
	|-object_Detection.py
	|-story_generation.py




App.py: This serves as the main entry point to run the project file structure.
Yolo.py: This file contains the code to download the pre trained yolov5 model for object detection and saves it in the model folder
Models: This folder contains the yolov5.pt file which has been generated by yolo.py file
Static: This folder saves all the input images that user inputs in the user interface
Index.html: This file is in templates folder and has the html components that is displayed in the user interface. This html page is rendered when the app.py file is run.
Object_detection.py: This file the yolov5 model is loaded and handles the object detection part for the input images and return the objects
Story_generation.py: This file handles the text generation part of the story telling using the objects detected in the images.
VII. Testing
This project can be tested by giving different images as input and observing the generated story.

VIII. Challenges and Solutions
The major problem we encountered in this project is the accuracy, i.e. the generation of text which should be as a story appropriate for kids. Object detection is done accurately to an extent but the story is being randomly generated text.

IX. Future Enhancements:
This project can be further enhanced by introducing features like customization in character names, and the theme of the story by the user. And also audio output so as the user can listen to it instead of text.

X. Credits and References:
This project, Story Generator from Images, was made possible through the efforts and contributions of the team members mentors and guide.
