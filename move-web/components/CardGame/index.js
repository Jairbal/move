/* eslint-disable jsx-a11y/no-static-element-interactions */
import { useEffect, useState } from "react";
import { getUrlImg } from "firebase/client";
import Link from "next/link";

export default function CardPatient({ game }) {
    console.log(game)
  const { name, cover, link } = game;

  /* const handleClickGame = () => {
		setSelectedGame({ ...game });
	}; */

  return (
    <>
      <Link href={link}>
        <div
          //onClick={handleClickGame}
          className="card text-white user-select-none cursorPointer cardClick m-1 mb-2"
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
      </Link>

      <style jsx>
        {`
          .bgPGame {
            width: 22rem;
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
        `}
      </style>
    </>
  );
}
