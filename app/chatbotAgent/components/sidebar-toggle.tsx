import type { ComponentProps } from 'react';



import { SidebarLeftIcon } from './icons';
import { Button } from './ui/button';
import { SidebarTrigger, useSidebar } from './ui/sidebar';
import { Tooltip, TooltipTrigger, TooltipContent } from './ui/tooltip';

export function SidebarToggle({
  className,
}: ComponentProps<typeof SidebarTrigger>) {
  const { toggleSidebar } = useSidebar();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          data-testid="sidebar-toggle-button"
          onClick={toggleSidebar}
          variant="outline"
          className="md:px-2 md:h-fit"
        >
          <SidebarLeftIcon size={16} />
        </Button>
      </TooltipTrigger>
      <TooltipContent align="start">Toggle Sidebar</TooltipContent>
    </Tooltip>
  );
}
