import { Stack, Box, Text } from "@chakra-ui/react";
import { PaginationItem } from "./PaginationItem";

interface PagionationProps {
  totalCountOfRegisters: number;
  registerPerPage?: number;
  currentPage?: number;
  onPageChange: (page: number) => void;
}

const siblingsCount = 2;

function generatePagesArray(from: number, to: number) {
  return [...new Array(to - from)]
    .map((_, index) => {
      return from + index + 1;
    })
    .filter((page) => page > 0);
}

// a) Essa função é para gerar um array de numberos que vai de ffrom  a "to". Por exemplo, se eu eu colo de 2 a 5, ele vai gerar um array com 2, 3, 4 e 5.
// b) Spread ... new Array serve para criar um array em branco com um range.
// c) return [...new Array(to - from)], se eu escolho um array de 2  a 10, ele vai gerar um array com 8 espaços em branco, por exemplo.
// d) return [...new Array(to - from)].map((_, index) => {
//   return from + index + 1;
//  }); Esse map eu ignorei o primeir paramentro porque ta em branco e peguei o index. Vou retornar então e preencher o array com um valor "from" + index + 1, ou seja, se eu chamarar o generatePagesArray(2, 5) com 2 e 5, logo, elevai criar um array com tamanho de to - from, ou seja, 3 posições: [0, 0, 0]. E depois ele vai percorrer e pra cada um ele vai pegar o indice, mo primeiro por exemplo ele vai pegar o from(2) + indice(0) + 1 que é o sibling, então o array vai icar [ 3, 0, 0], assim sucessivamente [3, 2+1+1, 2+2+1] = [3,4,5], ou seja, vai pegar o que cabe entre 2 e 5, descartando o numero do from, ficando 3, 4 e 5.
// e)  .filter((page) => page > 0); é para que caso algum calculo der menor que 1, ele não apareça.

export function Pagination({
  totalCountOfRegisters,
  registerPerPage = 10,
  currentPage = 1,
  onPageChange,
}: PagionationProps) {
  const lastPage = Math.ceil(totalCountOfRegisters / registerPerPage);

  const previousPages =
    currentPage > 1
      ? generatePagesArray(currentPage - 1 - siblingsCount, currentPage - 1)
      : [];

  // a) Para saber as previos pages, primeiro tenho que saber se a página atual é maior que 1, porque 1 não tem página anterior.
  //b) Chamo a função  generatePagesArray(), que vai ser from: currentPage - 1 - siblignsCoutn
  // até a currentPage -1: generatePagesArray(currentPage - 1 - siblingsCount, currentPage - 1

  const nextPages =
    currentPage < lastPage
      ? generatePagesArray(
          currentPage,
          Math.min(currentPage + siblingsCount, lastPage)
        )
      : [];

  //a) Só vai existir se a página atual for menor que a lastPage
  //b)  generatePagesArray(
  //   currentPage,
  //   Math.min(currentPage + siblingsCount, lastPage)
  // ) eu gero da current page e o minimo entre currentPage + siblingsCout e a lastPage, ou seja,

  return (
    <Stack
      direction={["column", "row"]}
      spacing="6"
      mt="8"
      justify="space-between"
      align="center"
    >
      <Box>
        <strong>0</strong> - <strong>10</strong> de <strong>100</strong>
      </Box>
      <Stack direction="row" spacing="2">
        {currentPage > 1 + siblingsCount && (
          <>
            <PaginationItem onPageChange={onPageChange} number={1} />
            {currentPage > 2 + siblingsCount && (
              <Text color="gray.300" w="8" textAlign="center">
                ...
              </Text>
            )}
          </>
        )}
        {/* 
        3) Ou seja, aqui eu quero mostrar a first page, que vai aparecer quando a pagina atual maior que a siblingcount +1 
        
        5) Para  colocar "..." entre first page, sibligns page e last page 
        (1...3 4 5 6 ... 20) primeiramente tenho que colocar o fragmento <></> entre a condicional e o pagination item.
        6) {currentPage > 2 + siblingsCount && (
              <Text color="gray.300" w="8" textAlign="center">
                ...
              </Text>
            )} 

            faço então que se a página atual for menor que 2 + siblingCount, ou seja, se eu estou na pagina 5, e a pagina atual é 3, sendo que 3 é menor que 2+ 2, então a first page vai ficar distante da current page, logo, é preciso colocar o "..." 
        
        */}

        {previousPages.length > 0 &&
          previousPages.map((page) => {
            return (
              <PaginationItem
                onPageChange={onPageChange}
                number={page}
                key={page}
              />
            );
          })}

        {/* 2) Crio as paginas anteriores, se previos page. length for maior que zero. 
              Percorro então as previous page e pra cada uma crio uma com o numero dela e a key.
        */}

        <PaginationItem
          onPageChange={onPageChange}
          number={currentPage}
          isCurrent
        />

        {/* 1) crio um pagination item que vai ser a pagina atual, vai ficar no meio. */}

        {nextPages.length > 0 &&
          nextPages.map((page) => {
            return (
              <PaginationItem
                onPageChange={onPageChange}
                number={page}
                key={page}
              />
            );
          })}

        {/* 3) Mesmo processo da 2 com as nextpages.
         */}

        {currentPage + siblingsCount < lastPage && (
          <>
            {currentPage + 1 + siblingsCount < lastPage && (
              <Text color="gray.300" w="8" textAlign="center">
                ...
              </Text>
            )}

            <PaginationItem onPageChange={onPageChange} number={lastPage} />
          </>
        )}
        {/* 
        4) Ou seja, se curentpage + siblings page ainda assim for menor que a última pagina, eu mostro ela, já que ela não vai estar aparecendo */
        /* 7) Mesmo processo da 5 e 6, mas com a last page.
         */}
      </Stack>
    </Stack>
  );
}
