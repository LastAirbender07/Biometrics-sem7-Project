# import cv2
# import numpy as np
# import face_recognition
# import os

# def load_images_from_folder(folder_path):
#     images = []
#     class_names = []
#     file_list = os.listdir(folder_path)
    
#     for file_name in file_list:
#         img = cv2.imread(os.path.join(folder_path, file_name))
#         if img is not None:
#             images.append(img)
#             class_names.append(os.path.splitext(file_name)[0])
    
#     return images, class_names

# def find_encodings(images):
#     encodings = []
#     for img in images:
#         img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
#         encoding = face_recognition.face_encodings(img_rgb)[0]
#         encodings.append(encoding)
#     return encodings

# def classify_image(test_image_path, known_encodings, class_names, threshold=0.6):
#     test_img = cv2.imread(test_image_path)
#     img_rgb = cv2.cvtColor(test_img, cv2.COLOR_BGR2RGB)
    
#     face_locations = face_recognition.face_locations(img_rgb)
#     face_encodings = face_recognition.face_encodings(img_rgb, face_locations)
    
#     for encoding in face_encodings:
#         matches = face_recognition.compare_faces(known_encodings, encoding, tolerance=threshold)
#         face_distances = face_recognition.face_distance(known_encodings, encoding)
#         best_match_index = np.argmin(face_distances)
        
#         if matches[best_match_index]:
#             name = class_names[best_match_index].upper()
#             accuracy = (1 - face_distances[best_match_index]) * 100
#             return name, round(accuracy, 2)
    
#     return "Unknown", None

# def main():
#     dataset_path = 'train'  # Path to your training images
#     test_image_path = 'test.jpg'  # Path to your test image
    
#     # Load training images and compute encodings
#     print("Loading training images...")
#     images, class_names = load_images_from_folder(dataset_path)
#     print(f"Loaded {len(images)} images from {dataset_path}")
    
#     print("Finding face encodings...")
#     known_encodings = find_encodings(images)
#     print("Encoding complete.")
    
#     # Classify the test image
#     print(f"Classifying test image: {test_image_path}")
#     name, accuracy = classify_image(test_image_path, known_encodings, class_names)
    
#     if accuracy:
#         print(f"Recognized as {name} with {accuracy}% accuracy")
#     else:
#         print("Face not recognized")

# if __name__ == "__main__":
#     main()


import cv2
import numpy as np
import face_recognition
import os

def load_images_from_folder(folder_path):
    images = []
    class_names = []
    file_list = os.listdir(folder_path)
    
    for file_name in file_list:
        img = cv2.imread(os.path.join(folder_path, file_name))
        if img is not None:
            images.append(img)
            class_names.append(os.path.splitext(file_name)[0])
    
    return images, class_names

def find_encodings(images):
    encodings = []
    for img in images:
        img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        encoding = face_recognition.face_encodings(img_rgb)[0]
        encodings.append(encoding)
    return encodings

def classify_and_annotate_image(test_image_path, known_encodings, class_names, threshold=0.6):
    test_img = cv2.imread(test_image_path)
    img_rgb = cv2.cvtColor(test_img, cv2.COLOR_BGR2RGB)
    
    face_locations = face_recognition.face_locations(img_rgb)
    face_encodings = face_recognition.face_encodings(img_rgb, face_locations)
    
    annotated_img = test_img.copy()  # Copy the image for annotation

    for (top, right, bottom, left), encoding in zip(face_locations, face_encodings):
        matches = face_recognition.compare_faces(known_encodings, encoding, tolerance=threshold)
        face_distances = face_recognition.face_distance(known_encodings, encoding)
        best_match_index = np.argmin(face_distances)
        
        if matches[best_match_index]:
            name = class_names[best_match_index].upper()
            accuracy = (1 - face_distances[best_match_index]) * 100

            # Draw a thicker rectangle around the face
            cv2.rectangle(annotated_img, (left, top), (right, bottom), (0, 255, 0), 7)  # Increased thickness
            
            # Draw rectangles around eyes
            face_landmarks = face_recognition.face_landmarks(img_rgb, [(top, right, bottom, left)])[0]
            for eye in ['left_eye', 'right_eye']:
                if eye in face_landmarks:
                    for (x, y) in face_landmarks[eye]:
                        cv2.circle(annotated_img, (x, y), 6, (0, 0, 255), -1)
                    # Draw a bounding box around the eyes
                    eye_coords = face_landmarks[eye]
                    eye_left = min(x for x, y in eye_coords)
                    eye_right = max(x for x, y in eye_coords)
                    eye_top = min(y for x, y in eye_coords)
                    eye_bottom = max(y for x, y in eye_coords)
                    cv2.rectangle(annotated_img, (eye_left, eye_top), (eye_right, eye_bottom), (255, 0, 0), 3)

            # Save the image with annotations
            output_path = f"{name}_classified.jpg"
            cv2.imwrite(output_path, annotated_img)
            print(f"Image saved as {output_path}")
            
            return name, round(accuracy, 2), annotated_img
    
    # Save the image with "Unknown" label if not recognized
    output_path = "unknown_classified.jpg"
    cv2.imwrite(output_path, annotated_img)
    print(f"Image saved as {output_path}")
    
    return "Unknown", None, annotated_img

def main():
    dataset_path = 'train'  # Path to your training images
    test_image_path = 'test.jpg'  # Path to your test image
    
    # Load training images and compute encodings
    print("Loading training images...")
    images, class_names = load_images_from_folder(dataset_path)
    print(f"Loaded {len(images)} images from {dataset_path}")
    
    print("Finding face encodings...")
    known_encodings = find_encodings(images)
    print("Encoding complete.")
    
    # Classify the test image and annotate it
    print(f"Classifying and annotating test image: {test_image_path}")
    name, accuracy, annotated_img = classify_and_annotate_image(test_image_path, known_encodings, class_names)
    
    if accuracy:
        print(f"Recognized as {name} with {accuracy}% accuracy")
    else:
        print("Face not recognized")

if __name__ == "__main__":
    main()
