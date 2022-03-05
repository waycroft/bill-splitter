export default function ({ loaderData }: { loaderData: any}) {
  let res = [];
  for (const [key, val] of Object.entries(loaderData)) {
    console.log('key:', key, 'val:', val);
    const ele = (
      <input
        readOnly
        hidden
        type="text"
        name={key.toString()}
        value={JSON.stringify(val)}
      />
    );
    res.push(ele);
  }
  console.log('res:', res);
  return (
    <div>
      {res}
    </div>
  )
}
