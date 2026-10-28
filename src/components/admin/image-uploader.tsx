import { useState } from "react";
import { X, Upload } from "lucide-react";
import { uploadMedia } from "../lib/media";
import { toast } from "sonner";

export function ImageUploader({
  value,
  onChange,
  folder = "uploads",
}: {
  value: string[];
  onChange: (urls: string[]) => void;
  folder?: string;
}) {
  const [busy, setBusy] = useState(false);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setBusy(true);
    try {
      const urls: string[] = [];
      for (const f of Array.from(files)) {
        const url = await uploadMedia(f, folder);
        urls.push(url);
      }
      onChange([...value, ...urls]);
      toast.success(`${urls.length} image(s) ajoutée(s)`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erreur d'upload");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <div className="grid grid-cols-3 md:grid-cols-4 gap-2 mb-3">
        {value.map((url, i) => (
          <div key={i} className="relative group aspect-square rounded-sm overflow-hidden border border-sand-300">
            <img src={url} alt="" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => onChange(value.filter((_, j) => j !== i))}
              className="absolute top-1 right-1 rounded-full bg-night-900/60 text-white p-1 opacity-0 group-hover:opacity-100"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
        <label
          className="aspect-square flex flex-col items-center justify-center gap-1 rounded-sm border-2 border-dashed border-sand-300 text-night-400 text-xs cursor-pointer hover:border-terracotta-400 hover:text-terracotta-600"
        >
          <Upload className="w-5 h-5" />
          {busy ? "Envoi…" : "Ajouter"}
          <input
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            disabled={busy}
            onChange={(e) => handleFiles(e.target.files)}
          />
        </label>
      </div>
    </div>
  );
}
