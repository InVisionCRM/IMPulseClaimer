import 'react'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      /**
       * The AppKit button web component. Registered globally by AppKit.
       */
      'appkit-button': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
        'theme'?: string;
        'accent-color'?: string;
        'modal-size'?: string;
      }, HTMLElement>;
      /**
       * The ElevenLabs Convai widget web component.
       */
      'elevenlabs-convai': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
        'agent-id': string;
      }, HTMLElement>;
    }
  }
}

// Ensures file is treated as a module
export {} 