"use client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,DialogTrigger} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select,SelectContent,SelectGroup, SelectItem, SelectLabel,SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { getCategoryById } from "@/lib/actions/get-actions";
import { handleSubmitCategory } from "@/lib/actions/submit-actions";
import { colorsName } from "@/lib/constants";
import 'moment/locale/es';
import { CategoryType, ICategories } from "@/types/types";
import moment from "moment";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

interface Props {
  trigger?: ReactNode;
  type: CategoryType;
  isOpen?: boolean;
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  id?: string;
}

export function CategoryDialog({
  trigger,
  isOpen,
  setIsOpen,
  type,
  id,
}: Props) {
  const router = useRouter()
  const [category, setCategory] = useState<ICategories | null>(null);
  const [name, setName] = useState("");
  const [color, setColor] = useState("");
  const [createAt, setCreateAt] = useState("");

  console.log("desde category", isOpen);
  
  useEffect(() => {
    if (id && type === "edit") {
      const fetchCategory = async () => {
        const categoryData = await getCategoryById(id);
        if (categoryData) {
          setCategory(categoryData);
          setName(categoryData.name);
          setColor(categoryData.color);
          setCreateAt(categoryData.created_at);
        }
      };
      fetchCategory();
    }
  }, [id, type]);

  useEffect(() => {
    if (color) {
      const defaultColorObj = findColorByName(color);
      if (defaultColorObj) {
        setColor(defaultColorObj.color);
      }
    }
  }, [color]);

  let types = type === "create" ? "Crea una" : "Edita la";

  const findColorByName = (colorValue: any) => {
    return colorsName.find((color) => color.color === colorValue);
  };

  const date = new Date(createAt);
  moment.locale('es');
  const newDate = moment(date).fromNow();

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = await handleSubmitCategory(type, id, name, color);
    if (result?.success) {
      router.refresh()
      
      // Aquí puedes manejar el éxito de la operación, como cerrar el diálogo
      console.log("Operación exitosa:", result.data);
    } else {
      // Manejar errores aquí
      console.error("Error en la operación:", result?.error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{types} Categoria</DialogTitle>
          <DialogDescription>
            {createAt ? `Ult Act ${newDate}` : "Completa los datos"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleFormSubmit}>
          <div className="flex  flex-col space-y-4">
            <div className="space-y-1">
              <Label htmlFor="category">Nombre</Label>
              <Input
                type="text"
                id="category"
                placeholder="New Category"
                value={name || ""}
                onChange={(event) => setName(event.target.value)}
                className="bg-transparent"
              />
            </div>
            <div className="flex items-center gap-2">
              <Label>Color:</Label>
              <Select value={color} onValueChange={(value) => setColor(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un color" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Estado</SelectLabel>
                    {colorsName.map((color) => (
                      <SelectItem key={color.id} value={color.color}>
                        <div className="flex gap-1 items-center justify-center">
                          <div
                            className={`w-4 h-4 ${color.color} rounded-full`}
                          />
                          <span className="">{color.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="sm:justify-start mt-5">
            <DialogClose asChild>
              <Button type="submit" variant="default" className="w-full">
                {type === "create" ? "Agregar" : "Actualizar"}
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
