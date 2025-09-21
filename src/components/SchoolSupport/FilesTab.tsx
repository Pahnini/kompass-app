import React from 'react';
import { useUser } from '@supabase/auth-helpers-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next'; // ✅
import { supabase } from '../../utils/supabase';

type FileItem = {
  id: string;
  file_name: string;
  file_url: string;
  created_at: string;
};

export default function FilesTab() {
  const { t } = useTranslation();
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

    void loadFiles();
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
      console.error(t('errors.uploadError'), uploadError.message);
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

    if (insertError) console.error(t('errors.dbError'), insertError.message);

    setUploading(false);
    window.location.reload();
  };

  const getPublicUrl = (path: string) =>
    supabase.storage.from('school-files').getPublicUrl(path).data.publicUrl;

  return (
    <div>
      <h2>{t('schoolSupport.learningMaterials')}</h2>

      <label>
        <span style={{ color: 'white' }}>{t('schoolSupport.uploadFile')}</span>
        <input
          type="file"
          onChange={e => void handleUpload(e)}
          disabled={uploading}
          className="mt-1 block w-full text-sm file:mr-4 file:py-2 file:px-4
            file:rounded-lg file:border-0
            file:text-sm file:font-semibold
            file:bg-[#2f4f4f] file:text-white
            hover:file:bg-[#0b9444] transition"
        />
      </label>

      {files.length === 0 ? (
        <p>{t('schoolSupport.noFiles')}</p>
      ) : (
        <ul className="space-y-4">
          {files.map(file => (
            <li key={file.id}>
              <a
                href={getPublicUrl(file.file_url)}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 underline hover:text-blue-800"
              >
                {file.file_name}
              </a>
              <p>
                {t('schoolSupport.uploadedOn').replace(
                  '{date}',
                  new Date(file.created_at).toLocaleString()
                )}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
