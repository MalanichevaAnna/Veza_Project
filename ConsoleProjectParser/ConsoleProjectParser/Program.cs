
using BL;
using System;
using System.Text.RegularExpressions;

namespace ConsoleProjectParser
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("Введите URL");
            var address = Console.ReadLine();

            if (!Regex.IsMatch(address, @"^?https*:\/\/", RegexOptions.IgnoreCase))
            {
                address = "http://" + address;
            }

            Console.WriteLine("Введите селектор");
            var selector = Console.ReadLine();

            var parser = new Parser(address, selector); 
          
            
            var info = parser.ParserHtml().Result;

            Console.WriteLine("Имя файла");
            var path = Console.ReadLine();

            if (!Regex.IsMatch(path, @"^?xlsx", RegexOptions.IgnoreCase))
            {
                path += ".xlsx";
            }

            Excel.Write(info, path, address);

            Console.WriteLine("\nЗаписано в Excel");
        }
    }
}
