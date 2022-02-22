import { Form } from 'remix';

export default function NewTransactionRoute() {
  return (
    <div>
      <div>
        <h1 className="text-4xl font-bold">Add Transaction</h1>
      </div>
      <div>
        <Form method='post'>
          {/* <input type='number' name='' */}
        </Form>
      </div>
    </div>
  )
}