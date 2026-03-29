import AgoraRTC, { IAgoraRTCClient, ILocalVideoTrack } from 'agora-rtc-sdk-ng';
import { useEffect, useRef, useState } from 'react';

export type AgoraRoomProps = { appId: string; channel: string; token: string; uid: number };

/**
 * Minimal Agora RTC publish + remote subscribe sample.
 * For production: fetch short-lived token from telemedicine-service; enable TLS; handle reconnect.
 */
export function AgoraVideoRoom({ appId, channel, token, uid }: AgoraRoomProps) {
  const divRef = useRef<HTMLDivElement>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let client: IAgoraRTCClient | null = null;
    let local: ILocalVideoTrack | null = null;
    setErr(null);

    (async () => {
      try {
        client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
        await client.join(appId, channel, token || null, uid);
        local = await AgoraRTC.createCameraVideoTrack();
        if (divRef.current) {
          local.play(divRef.current);
        }
        await client.publish([local]);
        client.on('user-published', async (user, mediaType) => {
          await client!.subscribe(user, mediaType);
          if (mediaType === 'video') {
            const el = document.createElement('div');
            el.className = 'h-48 w-full rounded-lg bg-black';
            divRef.current?.appendChild(el);
            user.videoTrack?.play(el);
          }
        });
      } catch (e) {
        setErr(e instanceof Error ? e.message : 'Agora error');
      }
    })();

    return () => {
      local?.close();
      client?.leave().catch(() => {});
    };
  }, [appId, channel, token, uid]);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="mb-2 font-semibold">Video (Agora RTC)</h3>
      {err && <p className="text-sm text-red-600">{err}</p>}
      <div ref={divRef} className="min-h-[12rem] w-full rounded-lg bg-black/80" />
      <p className="mt-2 text-xs text-slate-500">
        Use real <code className="rounded bg-slate-100 px-1">appId</code>, channel, and token from the backend when Agora is configured.
      </p>
    </div>
  );
}
