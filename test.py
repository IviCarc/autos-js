fechas = ["10/12/04", "15/3/2004", "desconocida"]

def formatear (fecha):
        if fecha == 'desconocida':
                return fecha
        else:
                split =  fecha.split("/")
                if int(split[2]) < 2000:
                        split[2] = "20" + split[2]
                return split[2] + "/" +split[1] + "/" +split[0]

formatFechas = map(formatear,fechas)

print(list(formatFechas))