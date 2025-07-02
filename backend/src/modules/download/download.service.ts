// image-download.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { createReadStream, statSync, existsSync } from 'fs';
import { join, extname } from 'path';
import * as mime from 'mime-types';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DownloadService {
  constructor(private configService: ConfigService) {}
  private readonly uploadDir = join(
    process.cwd(),
    this.configService.get('UPLOADS_FOLDER'),
  );

  getImageStream(filename: string) {
    const filePath = join(this.uploadDir, filename);

    if (!existsSync(filePath)) {
      throw new NotFoundException('Image not found');
    }

    const mimeType =
      mime.lookup(extname(filePath)) || 'application/octet-stream';
    const stream = createReadStream(filePath);
    const fileStat = statSync(filePath);

    return {
      stream,
      mimeType,
      fileSize: fileStat.size,
      filename,
    };
  }

  getDownloadUrl(filename: string): string {
    const host = this.configService.get('HOST');
    const port = this.configService.get('PORT');
    return `${host}:${port}/download/${filename}`;
  }

  getDownloadUrls(filenames: string[]): string[] {
    return filenames?.map((name) => this.getDownloadUrl(name));
  }
}
