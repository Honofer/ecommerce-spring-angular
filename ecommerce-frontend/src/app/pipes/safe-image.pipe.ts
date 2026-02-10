import { Pipe, PipeTransform, inject } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Pipe({
  name: 'safeImage',
  standalone: true
})
export class SafeImagePipe implements PipeTransform {
  private sanitizer = inject(DomSanitizer);
  private readonly placeholder = 'https://placehold.co/400x400?text=No+Image';

  transform(url: string | undefined | null): SafeUrl {
    if (!url || typeof url !== 'string' || url.trim() === '') {
      return this.placeholder;
    }

    let cleanUrl = url.trim().replace(/[\s\r\n]/g, '');

    if (cleanUrl.startsWith('data:image')) {
      return this.sanitizer.bypassSecurityTrustUrl(cleanUrl);
    }

    if (cleanUrl.startsWith('http')) {
      return cleanUrl;
    }

    if (cleanUrl.includes(':\\') || cleanUrl.startsWith('/')) {
      return this.placeholder;
    }

    cleanUrl = cleanUrl.replace(/[^A-Za-z0-9+/=]/g, '');

    const mimeType = this.guessMimeType(cleanUrl);
    return this.sanitizer.bypassSecurityTrustUrl(`data:${mimeType};base64,${cleanUrl}`);
  }

  private guessMimeType(base64: string): string {
    if (base64.startsWith('/9j/')) return 'image/jpeg';
    if (base64.startsWith('iVBORw0KGg')) return 'image/png';
    if (base64.startsWith('R0lGOD')) return 'image/gif';
    if (base64.startsWith('UklGR')) return 'image/webp';
    return 'image/png';
  }
}
