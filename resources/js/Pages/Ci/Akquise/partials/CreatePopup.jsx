import * as React from "react";
import { useMediaQuery } from "@uidotdev/usehooks";
import { Drawer, DrawerContent } from "@/Components/ui/drawer";
import { useEffect } from "react";
import Create_Form from "./Create_Form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/Components/ui/dialog";

export function CreatePopup({
  openParam,
  unselectLocation,
  location = null,
}) {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  useEffect(() => {
    // console.log("useEffectOpen:", openParam);
    setOpen(openParam);
  }, [openParam]);

  useEffect(() => {
    if (!open) {
      //   console.log("unselect");
      unselectLocation();
    }
  }, [open]);

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="">
          <DialogHeader>
            <DialogTitle>Projekt erstellen</DialogTitle>
          </DialogHeader>
          <div className="mt-4 border-t">
            <Create_Form
              latLon={location != null ? location : null}
              showMapInLastStep={false}
              closeDialog={setOpen}
            />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent>
        <div className="mt-4 border-t">
          <Create_Form
            latLon={location != null ? location : null}
            showMapInLastStep={false}
            closeDialog={setOpen}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
