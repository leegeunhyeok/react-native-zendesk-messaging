import { useState, useEffect } from 'react';
import * as Zendesk from 'react-native-zendesk-messaging';

interface UseZendeskProps {
  channelKey: string;
  onInitialized?: () => void;
  onError?: (error: unknown) => void;
}

export function useZendesk({
  channelKey,
  onInitialized,
  onError,
}: UseZendeskProps): {
  isReady: boolean;
} {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    Zendesk.initialize({ channelKey })
      .then(() => setIsReady(true))
      .then(() => onInitialized?.())
      .catch((error) => onError?.(error));
  }, [channelKey]);

  return { isReady };
}
