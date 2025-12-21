export async function uploadToCloudinary(
  file,
  { cloudName, uploadPreset, folder }
) {
  if (!file) {
    throw new Error("Файл не выбран");
  }

  // Используем переменные окружения если параметры не переданы
  const finalCloudName =
    cloudName || import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const finalUploadPreset =
    uploadPreset || import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  if (!finalCloudName || !finalUploadPreset) {
    throw new Error(
      "Отсутствуют настройки Cloudinary. Проверьте переменные окружения."
    );
  }

  const form = new FormData();
  form.append("file", file);
  form.append("upload_preset", finalUploadPreset);
  if (folder) form.append("folder", folder);

  try {
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${finalCloudName}/upload`,
      {
        method: "POST",
        body: form,
      }
    );

    if (!res.ok) {
      throw new Error(`Ошибка загрузки: ${res.status}`);
    }

    const json = await res.json();
    return json.secure_url;
  } catch (error) {
    throw new Error(`Не удалось загрузить изображение: ${error.message}`);
  }
}
