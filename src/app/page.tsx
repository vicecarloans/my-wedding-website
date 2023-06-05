"use client";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

export default function Home() {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const handleRSVP = () => {
    dialogRef.current?.showModal();
  };

  return (
    <main>
      <div className="navbar bg-base-100 px-24 justify-between">
        <div>
          <Link href="/" className="btn btn-ghost normal-case text-xl">
            Logo here
          </Link>
        </div>
        <div>
          <ul className="menu menu-horizontal px-1">
            <li>
              <a href="https://github.com/vicecarloans" target="__blank">
                <Image src="/github.svg" alt="Github" width={26} height={26} />
              </a>
            </li>
          </ul>
        </div>
      </div>

      <button className="btn" onClick={handleRSVP}>
        RSVP now
      </button>
      <dialog id="rsvp" className="modal" ref={dialogRef}>
        <form method="dialog" className="modal-box w-11/12 max-w-5xl">
          <h3 className="font-bold text-lg">Hello!</h3>
          <p className="py-4">Click the button below to close</p>
          <div className="modal-action">
            {/* if there is a button, it will close the modal */}
            <button className="btn">Close</button>
          </div>
        </form>
      </dialog>
    </main>
  );
}
