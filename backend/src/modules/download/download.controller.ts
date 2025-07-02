import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { Public } from 'src/auth/decorators/public.decorator';
import { DownloadService } from 'src/modules/download/download.service';

@Public()
@Controller('download')
export class DownloadController {
  constructor(private readonly downloadService: DownloadService) {}
  @Get(':filename')
  async downloadImage(
    @Param('filename') filename: string,
    @Res() res: Response,
  ) {
    const {
      stream,
      mimeType,
      filename: realName,
    } = this.downloadService.getImageStream(filename);
    res.set({
      'Content-Type': mimeType,
      'Content-Disposition': `inline; filename="${realName}"`,
    });
    stream.pipe(res);
  }
}
