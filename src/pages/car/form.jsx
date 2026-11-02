import { useEffect, useState } from "react";
import { Button, Col, Input, Row } from "reactstrap";
import { useNavigate, useParams } from "react-router";
import { api, carImageUrl, rememberCarImage } from "../../configs/api.config";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];

const splitName = (name = "") => {
    const trimmed = name.trim();
    const space = trimmed.indexOf(" ");
    if (space === -1) {
        return { manufacture: trimmed, model: trimmed };
    }
    return {
        manufacture: trimmed.slice(0, space),
        model: trimmed.slice(space + 1),
    };
};

const CarForm = (props) => {
    const navigate = useNavigate()
    const { id } = useParams()
    const [existing, setExisting] = useState(null);
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);
    const [state, setState] = useState({
        name: '',
        price: '',
        category: '',
        status: true,
        image: null,
    });
    const [preview, setpreview] = useState(null);
    const [fileName, setFileName] = useState("");
    useEffect(() => {
        if (id) {
            api.get(`/api/v1/cars/${id}`).then(result => {
                const car = result?.data;
                setExisting(car);
                setState(prev => ({
                    ...prev,
                    name: [car?.manufacture, car?.model].filter(Boolean).join(" "),
                    price: car?.rent_per_day ?? "",
                    category: car?.type ?? "",
                    status: Boolean(car?.available),
                    image: null,
                }))
                if (car?.image) {
                    setpreview(carImageUrl(car.image));
                }
            }).catch(() => {
                setError("Gagal memuat data mobil");
            })
        }
    }, [id])
    const onchange = (e) => {
        const { name, value } = e.target;
        setState(prev => ({
            ...prev,
            [name]: value
        }))
    }
    const readPreview = (file) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(file);
    });
    const handleFile = async (event) => {
        const file = event.target.files?.[0];
        event.target.value = "";
        if (!file) return;
        const extensionOk = /\.(jpe?g|png|gif|webp)$/i.test(file.name);
        if (!ACCEPTED_TYPES.includes(file.type) && !extensionOk) {
            setError("Format foto harus JPG, PNG, GIF, atau WEBP");
            return;
        }
        setError("");
        setFileName(file.name);
        setState(prev => ({
            ...prev,
            image: file
        }));
        try {
            setpreview(await readPreview(file));
        } catch {
            setError("Foto tidak bisa dibaca. Coba pilih file lain.");
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        const { manufacture, model } = splitName(state.name);
        if (!manufacture || !state.price || !state.category) {
            setError("Nama, harga, dan kategori wajib diisi");
            return;
        }
        setSaving(true);
        try {
            let imageName = existing?.image || "car01.min.jpg";
            if (state.image instanceof File) {
                const formData = new FormData();
                formData.append("image", state.image);
                const uploaded = await api.post("/api/v1/cars/image", formData);
                imageName = uploaded?.data?.filename || imageName;
                if (preview) rememberCarImage(imageName, preview);
            }
            const body = {
                plate: existing?.plate || `CMS-${Date.now().toString().slice(-6)}`,
                manufacture,
                model: model || manufacture,
                image: imageName,
                rent_per_day: Number(state.price),
                capacity: existing?.capacity || 4,
                description: existing?.description || state.name,
                available_at: existing?.available_at || new Date().toISOString(),
                transmission: existing?.transmission || "Automatic",
                available: Boolean(state.status),
                type: state.category,
                year: existing?.year || new Date().getFullYear(),
                options: existing?.options || [],
                specs: existing?.specs || [],
            };
            if (id) {
                await api.put(`/api/v1/cars/${id}`, body);
            } else {
                await api.post("/api/v1/cars", body);
            }
            navigate("/car");
        } catch (err) {
            setError(err?.response?.data?.message || "Gagal menyimpan data mobil");
        } finally {
            setSaving(false);
        }
    }
    return (
        <div>
            <div className="d-flex justify-content-between mb-4">
                <h4>{props.title}</h4>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="bg-white p-3">
                    {error && (
                        <div className="alert alert-danger" role="alert">
                            {error}
                        </div>
                    )}
                    <Row>
                        <Col lg={10} className="d-flex flex-column gap-4">
                            <div className="d-flex gap-4 align-items-center">
                                <label style={{ width: '135px' }}>Nama/tipe Mobile</label>
                                <Input onChange={onchange} name="name" className="w-50" value={state?.name} />
                            </div>
                            <div className="d-flex gap-4 align-items-center">
                                <label style={{ width: '135px' }}>Harga</label>
                                <Input onChange={onchange} name="price" className="w-50" value={state.price} />
                            </div>
                            <div className="d-flex gap-4 align-items-center">
                                <label style={{ width: '135px' }}>Foto</label>
                                {/* <Input className="w-50" /> */}
                                <label
                                    htmlFor="car-image"
                                    className="border rounded-2 d-flex align-items-center justify-content-between px-2 mb-0"
                                    style={{ width: 423, height: 38, cursor: 'pointer' }}
                                >
                                    <span style={{ fontSize: 14, color: fileName ? '#000' : '#8A8A8A' }}>
                                        {fileName || 'Upload Foto Mobil'}
                                    </span>
                                    <i className="fa fa-upload" />
                                </label>
                                <input
                                    id="car-image"
                                    type="file"
                                    accept="image/jpeg,image/png,image/gif,image/webp,.jpg,.jpeg,.png,.gif,.webp"
                                    style={{ display: 'none' }}
                                    onChange={handleFile}
                                />
                            </div>
                            {preview && <div>
                                <div>
                                    <img width={500} src={preview} alt='pict-alt' />
                                </div>
                            </div>}
                            <div className="d-flex gap-4 align-items-center">
                                <label style={{ width: '135px' }}>Kategori</label>
                                <Input onChange={onchange} name='category' className="w-50" value={state?.category} />
                            </div>
                        </Col>
                    </Row>
                    <div className="mt-4 d-flex gap-3">
                        <Button onClick={() => navigate('/car')} type="button" size="sm" style={{ background: '#FFF', color: '#0D28A6' }}>Cancel</Button>
                        <Button type="submit" size="sm" style={{ background: '#0D28A6' }} disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
                    </div>
                </div>
            </form>
        </div>
    )
};
export default CarForm;
