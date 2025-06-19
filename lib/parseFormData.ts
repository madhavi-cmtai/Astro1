// lib/utils/parseFormData.ts

export async function parseFormData(req: Request): Promise<{
    fields: Record<string, string>;
    file: File | null;
}> {
    const formData = await req.formData();

    const fields: Record<string, string> = {};
    let file: File | null = null;

    for (const [key, value] of formData.entries()) {
        if (typeof value === "string") {
            fields[key] = value;
        } else if (value instanceof File) {
            file = value;
        }
    }

    return { fields, file };
}
  