export default function EditGiftForm() {
    return (
        <>
            <h4>✏️ Add/Edit Gift</h4>
            <form>
                <input className="form-control mb-2" placeholder="Gift name" />
                <input className="form-control mb-2" placeholder="Link (optional)" />
                <input className="form-control mb-2" type="number" placeholder="Price" />
                <button className="btn btn-primary">Save</button>
            </form>
        </>
    );
}
