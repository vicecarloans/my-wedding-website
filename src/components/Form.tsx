import { useForm, ValidationError } from "@formspree/react";

export interface IRSVPForm {}

const RSVPForm: React.FC<IRSVPForm> = () => {
  const [formState, submit] = useForm(process.env.NEXT_PUBLIC_FORM!);

  if (formState.succeeded) {
    return <p>Thanks for joining!</p>;
  }

  return (
    <form onSubmit={submit}>
      <div className="form-control w-full max-w-xs">
        <label className="label">
          <span className="label-text">Wh</span>
        </label>
      </div>
    </form>
  );
};

export default RSVPForm;
