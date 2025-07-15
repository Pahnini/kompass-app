import { useEffect, useState } from 'react';
import { supabase } from '../../utils/supabase';
import { useUser } from '@supabase/auth-helpers-react';

type FileItem = {
  id: string;
  file_name: string;
  file_url: string;
  created_at: string;
};

export default function FilesTab() {
  const user = useUser();
  const [files, setFiles] = useState<FileItem[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const loadFiles = async () => {
      if (!user) return;
      const { data, error } = await supabase
        .from('school_files')
        .select('*')
        .eq('for_user_id', user.id)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setFiles(data as FileItem[]);
      }
    };

    loadFiles();
  }, [user]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);

    const filePath = `${user.id}/${Date.now()}_${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from('school-files')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Upload-Fehler:', uploadError.message);
      setUploading(false);
      return;
    }

    const { error: insertError } = await supabase.from('school_files').insert([
      {
        file_name: file.name,
        file_url: filePath,
        for_user_id: user.id,
        uploader_id: user.id,
      },
    ]);

    if (insertError) console.error('DB-Fehler:', insertError.message);

    setUploading(false);
    window.location.reload();
  };

  const getPublicUrl = (path: string) =>
    supabase.storage.from('school-files').getPublicUrl(path).data.publicUrl;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6 text-[#2f4f4f] dark:text-white">📁 Lernmaterialien</h2>

      <label className="block mb-4">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
          Datei hochladen:
        </span>
        <input
          type="file"
          onChange={handleUpload}
          disabled={uploading}
          className="mt-1 block w-full text-sm file:mr-4 file:py-2 file:px-4
            file:rounded-lg file:border-0
            file:text-sm file:font-semibold
            file:bg-[#2f4f4f] file:text-white
            hover:file:bg-[#0b9444] transition"
        />
      </label>

      {files.length === 0 ? (
        <p>Keine Dateien vorhanden.</p>
      ) : (
        <ul className="space-y-4">
          {files.map(file => (
            <li
              key={file.id}
              className="p-4 border rounded-xl bg-white shadow-md dark:bg-slate-800 dark:border-slate-700"
            >
              <a
                href={getPublicUrl(file.file_url)}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 underline hover:text-blue-800"
              >
                {file.file_name}
              </a>
              <p className="text-xs text-gray-500 mt-1">
                Hochgeladen am {new Date(file.created_at).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
