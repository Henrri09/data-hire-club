import ReactGA from 'react-ga4';

type EventParams = {
  category: string;
  action: string;
  label?: string;
  value?: number;
};

export const useAnalytics = () => {
  const trackPageView = (path: string) => {
    ReactGA.send({ hitType: "pageview", page: path });
  };

  const trackEvent = ({ category, action, label, value }: EventParams) => {
    ReactGA.event({
      category,
      action,
      label,
      value,
    });
  };

  const trackJobView = (jobId: string, jobTitle: string) => {
    trackEvent({
      category: 'Jobs',
      action: 'View',
      label: `${jobId} - ${jobTitle}`,
    });
  };

  const trackJobSearch = (query: string, resultsCount: number) => {
    trackEvent({
      category: 'Jobs',
      action: 'Search',
      label: query,
      value: resultsCount,
    });
  };

  const trackJobApplication = (jobId: string, jobTitle: string) => {
    trackEvent({
      category: 'Jobs',
      action: 'Apply',
      label: `${jobId} - ${jobTitle}`,
    });
  };

  return {
    trackPageView,
    trackEvent,
    trackJobView,
    trackJobSearch,
    trackJobApplication,
  };
};