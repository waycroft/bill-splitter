import { ActionFunction, Form } from "remix";

const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const { total, isSplitEvenly } = Object.fromEntries(formData);
  // todo: form validation
};

export default function NewTransactionRoute() {
  return (
    <div>
      <div>
        <h1 className="text-4xl font-bold">Add Transaction</h1>
      </div>
      <div>
        <Form method="post">
          <fieldset className="input-group">
            <label htmlFor="total" className="label">
              Total amount:
            </label>
            <input
              type="number"
              name="total"
              defaultValue={0}
              className="input border-base-200"
            />
            <label htmlFor="isSplitEvenly" className="label">
              Splitting evenly?
            </label>
            <input
              type="checkbox"
              name="isSplitEvenly"
              value="checked"
              className="checkbox"
            />
            <button className="btn btn-primary rounded-md">
              Create Transaction
            </button>
          </fieldset>
        </Form>
      </div>
    </div>
  );
}
