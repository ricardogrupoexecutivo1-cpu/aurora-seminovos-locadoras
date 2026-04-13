import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type UploadLogoResponse = {
  success: boolean;
  message: string;
  temporary_mode?: boolean;
  uploaded?: boolean;
  file_name?: string | null;
  file_size?: number | null;
  file_type?: string | null;
};

function jsonResponse(body: UploadLogoResponse, status = 200) {
  return NextResponse.json(body, { status });
}

export async function GET() {
  return jsonResponse({
    success: true,
    message:
      "Rota de upload de logo ativa em modo temporário para estabilização do deploy.",
    temporary_mode: true,
    uploaded: false,
    file_name: null,
    file_size: null,
    file_type: null,
  });
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return jsonResponse(
        {
          success: false,
          message: "Nenhum arquivo enviado.",
          temporary_mode: true,
          uploaded: false,
          file_name: null,
          file_size: null,
          file_type: null,
        },
        400
      );
    }

    if (!(file instanceof File)) {
      return jsonResponse(
        {
          success: false,
          message: "Arquivo inválido enviado para upload.",
          temporary_mode: true,
          uploaded: false,
          file_name: null,
          file_size: null,
          file_type: null,
        },
        400
      );
    }

    return jsonResponse({
      success: true,
      message:
        "Upload de logo recebido com sucesso. Módulo em fase de estabilização para a primeira publicação.",
      temporary_mode: true,
      uploaded: false,
      file_name: file.name ?? null,
      file_size: typeof file.size === "number" ? file.size : null,
      file_type: file.type ?? null,
    });
  } catch (error) {
    console.error("Erro temporário em upload-logo:", error);

    const message =
      error instanceof Error
        ? error.message
        : "Erro interno temporário ao processar upload de logo.";

    return jsonResponse(
      {
        success: false,
        message,
        temporary_mode: true,
        uploaded: false,
        file_name: null,
        file_size: null,
        file_type: null,
      },
      500
    );
  }
}