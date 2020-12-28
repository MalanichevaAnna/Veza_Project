using OfficeOpenXml;
using System;
using System.Collections.Generic;
using System.IO;

namespace BL
{
    static public class Excel
    {
        private const int rowOffset = 2;

        static public void Write(IEnumerable<string> info, string path, string address)
        {
            if (info == null || string.IsNullOrEmpty(path))
            {
                throw new ArgumentNullException();
            }

            using var stream = new FileStream(path, FileMode.Create);

            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;

            using var package = new ExcelPackage(stream);

            var worksheet = package.Workbook.Worksheets.Add(address);

            var range = worksheet.Cells[1, 1];

            range.LoadFromCollection(info, true);

            range.AutoFitColumns();

            var lastRow = worksheet.Dimension.End.Row;

            range = worksheet.Cells[lastRow + rowOffset, 1];

            package.Save();
        }
    }
}
