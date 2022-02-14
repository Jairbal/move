import { useContext, useEffect, useState } from "react";
import { AuthContext } from "context/AuthContext";
import { fetchAgents } from "firebase/client";
import Modal from "react-modal";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

Modal.setAppElement("#modal");

export default function ModalAgent({ setSelected, modalIsOpen, setModalIsOpen }) {
  const { authUserTherapist } = useContext(AuthContext);
  const [agentSelected, setAgentSelected] = useState("");
  const [isAgentSelected, setisAgentSelected] = useState(false);
  const [agents, setAgents] = useState([]);

  useEffect(() => {
    if (authUserTherapist) {
      fetchAgents(setAgents);
    }
  }, [authUserTherapist]);

  useEffect(() => {
    if (agents.length > 0) {
      setAgentSelected(agents[0].agentId);
    }
  }, [agents]);

  const set = () => {
    if (agentSelected !== "") {
      setSelected(agentSelected);
      closeModal();
    }
  };

  const closeModal = () => {
    setModalIsOpen(false);
  }

  return (
    <Modal isOpen={modalIsOpen} style={customStyles}>
      <div className="container">
        <h5>Por favor seleccione un dispositivo</h5>
        <div className="row">
          <form>
            <div className="mb-3">
              <select
                className="form-select"
                aria-label="Default select example"
                value={agentSelected}
                onChange={(e) => setAgentSelected(e.target.value)}
              >
                {agents.map((agent) => (
                  <option value={agent.agentId} key={agent.id}>
                    {agent.name}
                  </option>
                ))}
              </select>
            </div>
            <button type="button" className="btn btn-primary" onClick={set}>
              Empezar a Jugar
            </button>
          </form>
        </div>
      </div>
    </Modal>
  );
}
