import { useContext, useEffect, useState } from "react";
import { AuthContext } from "context/AuthContext";
import { fetchDevices } from "firebase/client";

export default function ModalDevice() {
  const { authUserTherapist } = useContext(AuthContext);
  const [deviceSelected, setDeviceSelected] = useState("");
  const [isDeviceSelected, setisDeviceSelected] = useState(false);
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    if (authUserTherapist) {
      fetchDevices(setDevices);
    }
  }, [authUserTherapist]);

  return (
    <div className="modal-dialog modal-dialog-scrollable">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Por favor seleccione un dispositivo</h5>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div className="modal-body">
          <select
            className="form-select"
            aria-label="Default select example"
            value={deviceSelected}
            onChange={(e) => setDeviceSelected(e.target.value)}
          >
            {devices.map((device) => (
              <option value={device.deviceId} key={device.id}>
                {device.name}
              </option>
            ))}
          </select>
        </div>
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            Cancelar
          </button>
          <button type="button" className="btn btn-primary">
            Empezar a Jugar
          </button>
        </div>
      </div>
    </div>
  );
}
