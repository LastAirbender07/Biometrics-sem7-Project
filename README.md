# Multi-Modal Biometric Authentication System (Face & Iris)

## Project Overview

This project aims to develop a multi-modal biometric authentication system for Android devices. The system uses a two-step authentication process involving **face recognition** followed by **iris recognition**. This layered approach enhances security by leveraging two distinct biometric markers, providing robust protection for user authentication.

### Idea

The core idea of this project is to create a seamless yet secure authentication mechanism that requires users to first verify their face and then undergo iris recognition. By combining these two biometric modalities, the system ensures a higher level of security and reduces the risk of unauthorized access. This approach is particularly useful in sensitive applications such as banking, secure logins, and restricted access areas.

### Face Recognition Implementation

The face recognition part of the system uses a **pre-trained FaceNet model** to extract facial embeddings from a live video feed, such as from a mobile device’s camera. These embeddings are then classified using a **Support Vector Machine (SVM)** model to verify the identity of the user. This verification serves as the first step in the authentication process.

Key aspects of the face recognition process include:
- Detecting faces using Haar Cascade classifiers.
- Extracting 160x160 face embeddings using the FaceNet model.
- Identifying the user through an SVM classifier trained on known face embeddings.

### Iris Recognition Implementation

The second layer of authentication is based on **iris recognition**, where the user's iris is scanned and matched against pre-stored iris patterns. The iris recognition system is trained using the **CASIA Iris V4 dataset**, which includes a large collection of iris images.

For the iris recognition process:
- A **Deep Convolutional Neural Network (CNN)** is used to classify the iris images.
- The system performs minimal preprocessing, such as resizing and normalization of images, ensuring that the process remains efficient while maintaining high accuracy.
- The CNN model achieves a testing accuracy of **93.15%**, demonstrating strong performance in identifying users based on their iris patterns.

### Dataset

The iris recognition system uses the **CASIA Iris V4 dataset**, which provides grayscale images of iris scans from various individuals. This dataset is crucial for training and testing the iris recognition model to ensure high accuracy in real-world conditions.

- Dataset: [CASIA Iris V4](https://hycasia.github.io/dataset/casia-irisv4/)

### Training Strategy

To enhance the model's performance, several training strategies were implemented:
- **Early Stopping**: This monitors the validation loss and halts training when no improvement is observed.
- **Model Checkpointing**: Saves the model’s best weights during the training process based on validation metrics.
- **Reduce Learning Rate on Plateau**: Adjusts the learning rate when the validation loss stagnates, promoting faster convergence.

These strategies helped stabilize the model’s performance, ensuring both face and iris recognition systems could achieve optimal accuracy.

### Mobile Application Integration

A mobile application was developed to demonstrate the end-to-end functionality of the multi-modal biometric system. The application, named **IrisRecognizer**, incorporates both face and iris recognition models to authenticate users:
1. **Step 1: Face Recognition** - The user’s face is scanned and verified using the FaceNet model.
2. **Step 2: Iris Recognition** - Upon successful face verification, the system prompts the user to scan their iris for final authentication.

The models were optimized for mobile deployment by quantizing them to reduce memory usage and improve performance on Android devices.

### Performance and Accuracy

- **Face Recognition**: Achieves high accuracy with real-time face detection and identification.
- **Iris Recognition**: Achieves **93.15%** testing accuracy without requiring segmentation or complex preprocessing of the iris images.

### Conclusion

This project successfully combines face and iris recognition in a multi-modal biometric authentication system, providing enhanced security for mobile applications. The two-step process significantly reduces the chances of unauthorized access and makes this system ideal for high-security environments. With further optimization, this approach could be applied in areas such as secure banking, identity verification, and access control systems.

## References

- CASIA Iris V4 Dataset: [Link](https://hycasia.github.io/dataset/casia-irisv4/)
- FaceNet: [Link](https://github.com/serengil/keras-facenet)
