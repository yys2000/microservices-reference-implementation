import React, { useState } from 'react';
import DroneDeliveryService from '../services/DroneDeliveryService';
import './Request.css';

export const Request = () => {
  const packageSizes = ['Small', 'Medium', 'Large'];
  const [trackingKey, setTrackingKey] = useState('');
  const [packageSize, setPackageSize] = useState('Small');
  const [packageWeight, setPackageWeight] = useState('');
  const [showValidation, setShowValidation] = useState(false);
  const [validation, setValidation] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const onSend = async (event) => {
    event.preventDefault();
    setTrackingKey('');
    if (packageWeight) {
      setShowValidation(false);
      let deliveryRequest = {
        confirmationRequired: "None",
        deadline: "",
        dropOffLocation: "drop off",
        expedited: true,
        ownerId: "myowner",
        packageInfo: {
          packageId: "mypackage",
          size: packageSize,
          tag: "mytag",
          weight: packageWeight
        },
        pickupLocation: "my pickup",
        pickupTime: "2019-05-08T20:00:00.000Z"
      }
      sendDeliveryRequest(deliveryRequest);
    } else {
      setShowValidation(true);
      setValidation("Input package weight !!");
    }
  }

  const sendDeliveryRequest = async (deliveryRequest) => {
    const droneDeliveryService = new DroneDeliveryService();
    let deliveryResponse;
    try {
      deliveryResponse = await droneDeliveryService.deliveryRequest(deliveryRequest);
      setTrackingKey(deliveryResponse.deliveryId);
    } catch (error) {
      setShowErrorMessage(true);
      setErrorMessage('Request can not be processed !!');
    }
  }

  const onPackageWeightChange = (event) => {
    let weight = parseInt(event.target.value);
    if (!weight) {
      setShowValidation(true);
      setValidation("Input package weight !!");
    } else {
      setShowValidation(false);
    }
    setPackageWeight(weight);
  }
  const onPackageSizeChange = (event) => {
    setPackageSize(event.target.value);
  }
  return (
    <div>
      <h2 style={{ marginLeft: 20 }}>Request delivery</h2>
      <form onSubmit={onSend}>
        {showValidation && <span style={{ color: 'red', float: 'right' }}>{validation}</span>}
        <div style={{ marginBottom: 40 }}>
          <div className="container" >
            <p>Select Package size:</p>
            <select className="custom-input"
              placeholder="Select Package height"
              onChange={onPackageSizeChange}
            >
              {packageSizes.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div className="container">
            <p>Enter Package weight:</p>
            <input
              className={showValidation ? 'custom-input error' : 'custom-input'}
              placeholder="Enter package weight"
              onChange={onPackageWeightChange}
              type="number"
            />
          </div>
          <div className="request-button-container">
            <input className="main-button" type='submit' value="Request" />
          </div>
        </div>
        <div style={{ marginLeft: 20 }}>
          <p>Tracking ID:</p>
          <textarea style={{ width: '800px', height: '110px', border: '2px solid #008CBA', }} value={trackingKey} type="text"></textarea>
        </div>
      </form>

      {showErrorMessage && <span style={{ marginLeft: 19, color: 'red' }}>{errorMessage}</span>}
    </div>
  );
}