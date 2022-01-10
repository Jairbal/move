import { useEffect, useState } from "react";
import { useRouter } from 'next/router';

export default function ModalDevice({ devices, selectedGame }) {
  const [deviceSelected, setDeviceSelected] = useState("");
  const router = useRouter();

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
