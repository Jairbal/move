/* eslint-disable jsx-a11y/no-static-element-interactions */
import { useEffect, useState } from "react";
import { getUrlImg, assignGame } from "firebase/client";
import Link from "next/link";

export default function CardPatient({ game, selectedPatient }) {
  const { name, cover, id } = game;
  const [isSelected, setIsSelected] = useState(false);

  const handleAssignGame = () => {
    const isAssigned = selectedPatient.games.find((g) => g.idGame === id);
    if (isAssigned) {
      selectedPatient.games = selectedPatient.games.filter((g) => g.idGame !== id);
      assignGame(selectedPatient.games, selectedPatient.id);
    } else {
      selectedPatient.games = [...selectedPatient.games, { idGame: id, timePlayed: 0 }];
      assignGame(selectedPatient.games, selectedPatient.id);
    }
  };

  useEffect(() => {
    if(selectedPatient.games.find((g) => g.idGame === id)){
      setIsSelected(true);
    }else {
      setIsSelected(false);
    }
  }, [selectedPatient.games]);

  return (
    <>
      <div
        onClick={handleAssignGame}
        className={`card  user-select-none cursorPointer cardClick m-1 mb-2 ${isSelected ? 'selected text-primary' : 'text-white'}`}
      >
        <img
          src={cover}
          width={405}
          height={150}
          className="card-img rounded-3 bgGame "
          alt="..."
        />
        <div className="card-img-overlay rounded-3">
          <h5 className="card-title fw-bold">{name}</h5>
        </div>
      </div>

			<style jsx>
				{`
					.bgPGame {
						width: 18.75rem;
						height: 9.375rem;
					}

					.photo {
						font-size: 2.9375rem;
						height: 3.75rem;
						object-fit: contain;
					}

          .cardClick:active {
            transform: scale(0.98);
          }

          .selected {
            border: 5px solid #0d6efd;
          }
        `}
      </style>
    </>
  );
}
