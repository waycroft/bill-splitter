export default function ({ loaderData }: { loaderData: any}) {
  let res = [];
  for (const [key, val] of Object.entries(loaderData)) {
    const ele = (
      <input
        readOnly
        hidden
        type="text"
        key={key.toString()}
        name={key.toString()}
        value={JSON.stringify(val)}
      />
    );
    res.push(ele);
  }
  return (
    <div>
      {res}
    </div>
  )
}
